const fs = require("fs");
const path = require("path");
//! check line argument
const args = process.argv.slice(2);

//!Help message
function showHelp() {
  console.log("Text File Analyzer");
  console.log("Usage: node count.js <file.txt> [options]");
  console.log("\nOptions");
  console.log(" -h, --help  Show help");
  console.log(" -s, --summary Show only summary (total counts)");
  console.log(" -d, --detail Show detailed statistics");
  console.log("\nExample");
  console.log(" node count.js sample.txt");
  console.log(" node count.js sample.txt --detail");
  process.exit(0);
}

//!Show help if no arguments or help flag
if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
  showHelp();
}

//Pass command line options
const filePath = args[0];
const showDetail = args.includes("--detail") || args.includes("-d");
//validate the file path
if (!filePath.endsWith(".txt")) {
  console.log("Error: Please provide a .txt file");
  process.exit(1);
}
//check if file exists
if (!fs.existsSync(filePath)) {
  console.log(`Error: File ${filePath} does not exists`);
  process.exit(1);
}
//Read file content

//Count statistics
function countStatistics(buffer) {
  //! Convert buffer to string for text analysis
  const content = buffer.toString();
  //!count character (including whitespace)
  const charCount = buffer.length;
  //! Count lines (split by newline character)
  const lines = content.split(/\r?\n/);
  const lineCount = lines.length;
  //!Count words (split by whitespace)
  const words = content.split(/\s+/).filter((word) => word.length > 0);
  const wordCount = words.length;
  //! Get byte size
  const byteSize = buffer.byteLength;
  //! Additional statistics for detailed output
  let stats = {
    charCount,
    lineCount,
    wordCount,
    byteSize,
  };
  if (showDetail) {
    //! Count non-whitespace characters
    const nonWhitespaceCharCount = content.replace(/\s/g, "").length;
    //! Word length distributions
    const wordLengths = words.map((word) => word.length);
    const averageWordLength =
      wordLengths.reduce((sum, length) => sum + length, 0) / wordCount || 0;
    //! Count paragraphs (separated by double newlines)
    const paragraphCount = content
      .split(/\r?\n\s*\r?\n/)
      .filter((para) => para.trim().length > 0).length;
    //Find most common words
    const wordFrequency = {};
    words.forEach((word) => {
      const normalizedWord = word.toLowerCase().replace(/[^\w]/g, "");
      if (normalizedWord.length > 0) {
        wordFrequency[normalizedWord] =
          (wordFrequency[normalizedWord] || 0) + 1;
      }
    });
    const sortedWords = Object.entries(wordFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
  }
  //Add statistics
  stats = {
    ...stats,
  };
}

//Format byte size to human readable format
//display the statistics
//Main execution
