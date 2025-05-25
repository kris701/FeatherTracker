# API

The API consists of a main API and several plugins under it.

## Development Tools
Some tools are required for the API to compile and work well:

To automatically convert C# API models over to TypeScript ones:

`dotnet tool install --global CSharpToTypeScript.CLITool`

To automatically update shared API endpoint reference:

`dotnet tool install --global AutoPoint`

To automatically update shared const name reference:

`dotnet tool install --global AutoConst`

These tools are not nesessary for a general build, but are very usefull when it comes to development.