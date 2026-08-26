#!/usr/bin/env python3

"""
Generates a list of Linux package names which overlap with the English dictionary and a list of Linux package names which are good
candidates for fridge poetry (chosen by arbitrary criteria)
"""

import json
import logging

PACKAGE_LIST = "data/allpackages"
DICTIONARY_WORDS = "data/common.txt"


def get_package_name(line: str) -> str:
    """Extract the package name from a line in the Debian package list."""
    return line.split(sep=" ", maxsplit=1)[0].lower()


def good_poetry_candidate(name: str) -> bool:
    """Determine whether this word works as a fridge magnet"""
    # Disqualify package names that are long
    if len(name) > 9:
        return False
    # Disqualify package names with dashes and numbers
    if not name.isalpha():
        return False
    # Package names must have at least one vowel
    return any(
        ["a" in name, "e" in name, "i" in name, "u" in name, "o" in name, "y" in name]
    )


def main():
    dictionary_set = set()
    with open(DICTIONARY_WORDS, "r", encoding="utf-8") as dictionary_file:
        for word in dictionary_file.readlines():
            dictionary_set.add(word.strip().lower())

    logging.info(f"Loaded {len(dictionary_set)} dictionary words.")

    linuxtionary = set()
    poetry_candidates = set()

    with open(PACKAGE_LIST, "r", encoding="utf-8") as package_file:
        for package in package_file.readlines():
            package_name = get_package_name(package)
            if package_name in dictionary_set:
                logging.debug(f"{package_name} is a dictionary word.")
                linuxtionary.add(package_name)
            elif good_poetry_candidate(package_name):
                logging.debug(f"{package_name} is a good fridge poetry candidate.")
                poetry_candidates.add(package_name)
            else:
                logging.debug(f"{package_name} is skipped.")

    logging.info(
        f"Found {len(linuxtionary)} overlapping words between the Debian package list and the dictionary, and {len(poetry_candidates)} words that seem like good fridge poetry candidates."
    )
    with open("words/dictionary.js", "w", encoding="utf-8") as linuxtionary_file:
        linuxtionary_file.write("const DICTIONARY = ")
        json.dump(list(linuxtionary), linuxtionary_file)
        linuxtionary_file.write(";")
    logging.info("Wrote dictionary to words/dictionary.js.")
    with open("words/poetry.js", "w", encoding="utf-8") as magnets_file:
        magnets_file.write("const MAGNETS = ")
        json.dump(list(poetry_candidates), magnets_file)
        magnets_file.write(";")
    logging.info("Wrote poetry to words/poetry.js.")


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    main()
