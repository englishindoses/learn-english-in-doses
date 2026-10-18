"""Generate the website lesson registry from served HTML; no third-party packages.

Run from the repository root after adding/removing lessons or activities.
Unlisted tour-guide pages deliberately remain outside progress tracking.
"""
import json
import re
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlparse, unquote

ROOT = Path(__file__).resolve().parent.parent
VOID = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'}
WIDGETS = [
    ('mcq', 'option'), ('drag', 'drop-zone'), ('gap', 'gap-input'),
    ('dropdown', 'gap-dropdown'), ('wordgap', 'wgf-input'), ('fix', 'fs-input'),
    ('spelling', 'ss-input'), ('choose', 'cc-choice-group'), ('odd', 'ooo-group'),
    ('listen', 'lc-question'), ('compact', 'cm-answer-slot'),
    ('matching', 'matching-question'), ('vocab', 'vocab-drop-zone'),
    ('flashcards', 'flashcard'), ('speaking', 'sq-question'),
]


class Node:
    def __init__(self, tag='', attrs=(), parent=None):
        self.tag, self.attrs, self.parent = tag, dict(attrs), parent
        self.children, self.text = [], ''

    def all(self):
        for child in self.children:
            yield child
            yield from child.all()

    def has(self, cls):
        return cls in self.attrs.get('class', '').split()


class Page(HTMLParser):
    def __init__(self, html):
        super().__init__(convert_charrefs=True)
        self.root = Node()
        self.current = self.root
        self.feed(html)

    def handle_starttag(self, tag, attrs):
        node = Node(tag, attrs, self.current)
        self.current.children.append(node)
        if tag not in VOID:
            self.current = node

    def handle_endtag(self, tag):
        node = self.current
        while node.parent:
            if node.tag == tag:
                self.current = node.parent
                return
            node = node.parent

    def handle_data(self, text):
        node = self.current
        while node:
            node.text += text
            node = node.parent


def activities(page):
    result = {}
    for node in page.root.all():
        for kind, cls in WIDGETS:
            if not node.has(cls):
                continue
            owner = node.parent
            while owner and not (owner.attrs.get('id') and (
                any(owner.has(c) for c in ['activity-container', 'dropdown-activity', 'vocab-match-container',
                                          'flashcard-container', 'compact-matching', 'matching-container'])
                or owner.attrs['id'] in ['mcq', 'drag-drop', 'gap-fill', 'matching', 'flashcards', 'speaking-questions'])):
                owner = owner.parent
            if not owner:
                continue
            key = owner.attrs['id']
            result.setdefault(key, {'id': key, 'type': kind, 'total': 0})['total'] += 1
    # MCQ widgets are options, but the denominator counts questions.
    for item in result.values():
        if item['type'] == 'mcq':
            owner = next(n for n in page.root.all() if n.attrs.get('id') == item['id'])
            item['total'] = sum(n.has('question') for n in owner.all())
    return list(result.values())


def main():
    pages = {}
    for folder in ['grammar', 'vocabulary', 'travel', 'students/hb']:
        for file in (ROOT / folder).rglob('*.html'):
            if 'temp' in file.parts:
                continue
            page = Page(file.read_text(encoding='utf-8'))
            items = activities(page)
            if not items:
                continue
            # Spoken tasks cannot be graded by the browser. Give the learner an
            # explicit completion control instead of silently ignoring them.
            for heading in page.root.all():
                if heading.tag != 'h2' or not re.search(r'^(?:[^A-Za-z]*)(?:now it.s your turn|speaking(?:\b|:)|role[ -]play)', heading.text.strip(), re.I):
                    continue
                section = heading.parent
                while section and section.tag != 'section':
                    section = section.parent
                if not section or any(n.has(cls) for n in section.all() for _, cls in WIDGETS):
                    continue
                items.append({'id': section.attrs.get('id') or f'practice-task-{len(items)+1}',
                              'type': 'manual', 'total': 1, 'label': heading.text.strip()})
            key = file.relative_to(ROOT).as_posix()
            title = next((n.text.strip() for n in page.root.all() if n.tag == 'h1'), file.stem)
            pages[key] = {'path': key, 'title': title, 'activities': items, 'next': None,
                          'course': 'Personal lessons' if key.startswith('students/') else key.split('/')[0].title() + ' — ' + key.split('/')[1].replace('-', ' ').title()}

    # Follow the actual course indexes, not alphabetical filenames or stale prev/next links.
    indexes = ['grammar/beginner/beginner-grammar.html', 'grammar/intermediate/intermediate-grammar.html',
               'grammar/advanced/advanced-grammar.html', 'vocabulary/beginner/beginner-vocabulary.html',
               'travel/beginner-travel/travel-english.html']
    for index in indexes:
        ordered = []
        page = Page((ROOT / index).read_text(encoding='utf-8'))
        main_node = next((n for n in page.root.all() if n.tag == 'main'), page.root)
        for node in main_node.all():
            if node.tag == 'a':
                target = unquote(urlparse(urljoin('/' + index, node.attrs.get('href', ''))).path).lstrip('/')
                if target in pages and target not in ordered:
                    ordered.append(target)
        for current, following in zip(ordered, ordered[1:]):
            pages[current]['next'] = following

    output = '// Generated by tools/generate-website-catalog.py. Do not edit by hand.\n'
    output += 'window.WebsiteLessonCatalog = ' + json.dumps(list(pages.values()), ensure_ascii=False, indent=2) + ';\n'
    (ROOT / 'js/website-lesson-catalog.js').write_text(output, encoding='utf-8')
    print(f'Registered {len(pages)} lessons and {sum(len(p["activities"]) for p in pages.values())} activities.')


if __name__ == '__main__':
    main()
