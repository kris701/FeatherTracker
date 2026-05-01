# API

The API consists of a main API and several plugins under it.
You can start the API after build using:
`dotnet FeatherTracker.API.dll --jwtsecret "nM@arG0N4d7^zMHiK7c3AA9Oj$WOUS@Pr&i6yemW" --jwtlifetime 120 --dbconnectionstring "Server=tcp:localhost,6028;Initial Catalog=FeatherTracker.Database;Persist Security Info=False;User ID=sa;Password=yourStrong(!)Password;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=True;Connection Timeout=30;"`
With whatever secrets and passwords you want to use.

## Development Tools
Some tools are required for the API to compile and work well:

To automatically convert C# API models over to TypeScript ones:

`dotnet tool install --global CSharpToTypeScript.CLITool`

To automatically update shared API endpoint reference:

`dotnet tool install --global AutoPoint`

These tools are not nesessary for a general build, but are very usefull when it comes to development.