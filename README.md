# Paper-search: PubMed Research Paper Search Tool

A JavaScript tool to search and fetch academic papers from the Europe PMC free API.
> This tool uses the public [Europe PMC API](https://europepmc.org/RestfulWebService) to fetch biomedical literature.

## What It Does

- Searches biomedical literature in the Europe PMC database
- Fetches multiple pages of results automatically
- Extracts key information for each paper:
  - Title
  - Authors
  - Journal
  - Publication year
  - Full text availability
  - Link to the article
  - Optionally includes the abstract

## Requirements

- Node.js v12 or higher
- [`node-fetch`](https://www.npmjs.com/package/node-fetch) (if using Node < 18)

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/paper-search.git
cd paper-search

# Install dependencies (skip if Node 18+)
npm install node-fetch
 ```
## Usage

Edit the main() function in index.js (or your main script) with your search parameters:
```javascript
const result = await fetchAllPages('query', maxpages, searchYear, 'affiliation');
```
- query – Search term (required)
- maxpages – Maximum number of pages to fetch (optional)
- searchYear – Year of publication (optional)
- affiliation – Filter by author affiliation (optional)

Results will be saved as results.json and results.csv (if uncommented) in the current directory.

run the script 
```bash
node index.js
```
## License 
MIT License

