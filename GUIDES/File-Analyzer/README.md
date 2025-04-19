# Text File Word Counter

A Node.js command-line tool that counts words, lines, and characters in a text file.

## Features

- Counts the total number of words in a text file
- Counts the total number of lines in a text file
- Counts the total number of characters in a text file
- Shows file size in human-readable format
- Provides detailed statistics with the `--detail` flag
- Works with any text file (uses Buffer to handle different encodings)

## Usage

```bash
node count.js <file.txt> [options]
```

### Options

- `-h, --help`: Show help information
- `-s, --summary`: Show only summary information (default)
- `-d, --detail`: Show detailed statistics

### Examples

Count basic statistics in a text file:

```bash
node count.js sample.txt
```

Show detailed statistics:

```bash
node count.js sample.txt --detail
```

## Detailed Statistics

When using the `--detail` flag, the tool provides additional information:

- Non-whitespace character count
- Paragraph count
- Average word length
- Top 10 most common words with their frequencies

## Under the Hood

This application demonstrates several Node.js concepts:

1. **File System Operations**: Uses the `fs` module to read text files
2. **Command-line Argument Processing**: Parses arguments with `process.argv`
3. **Buffer Handling**: Reads files as buffers for accurate byte counting
4. **String Manipulation**: Processes text to extract statistical information
5. **Regular Expressions**: Uses regex for splitting text into words, lines, and paragraphs

## Sample Output

```
=== Text File Statistics ===

File: sample.txt
Size: 1.45 KB
Characters: 1483
Words: 262
Lines: 14

=== Detailed Statistics ===

Non-whitespace characters: 1223
Paragraphs: 7
Average word length: 4.67 characters

Most common words:
  "nodejs": 8 occurrences
  "file": 6 occurrences
  "javascript": 4 occurrences
  "and": 4 occurrences
  "the": 4 occurrences
  "is": 4 occurrences
  "with": 3 occurrences
  "for": 3 occurrences
  "operations": 3 occurrences
  "module": 2 occurrences

=== End of Statistics ===
```
