"""يحلل نص سكربت بصيغة `NAME: dialogue` سطر بسطر ويجمع كل الحوار حسب اسم المتكلم."""

import re
from collections import defaultdict

LINE_PATTERN = re.compile(r"^\s*([A-Za-z][A-Za-z .'-]{1,30}):\s*(.+)$")

MIN_LINES_PER_CHARACTER = 3


def parse_script(raw_text: str) -> dict[str, list[str]]:
    lines_by_character: dict[str, list[str]] = defaultdict(list)

    for line in raw_text.splitlines():
        match = LINE_PATTERN.match(line)
        if not match:
            continue
        name = match.group(1).strip().title()
        dialogue = match.group(2).strip()
        if dialogue:
            lines_by_character[name].append(dialogue)

    return {
        name: lines
        for name, lines in lines_by_character.items()
        if len(lines) >= MIN_LINES_PER_CHARACTER
    }
