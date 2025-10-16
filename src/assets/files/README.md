# Rates File

The rates file is in JSON format.
Edit the formatted version, called pretty, and then use a tool to minimize it.

An example in the Linux terminal is the jq tool.

```sh
# jq -c . input.json > minified.json
jq -c . rates2025-pretty.json > rates2025.json
```