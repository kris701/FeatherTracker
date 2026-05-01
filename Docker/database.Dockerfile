FROM compulim/msbuild AS database
WORKDIR /source

# copy everything else and build api
COPY Database/FeatherTracker.Database/FeatherTracker.Database.sqlproj ./Database/FeatherTracker.Database/FeatherTracker.Database.sqlproj
WORKDIR /source
RUN mmsbuild /t:Build,Publish /p:TargetDatabaseName=FeatherTracker.Database /p:DeployScriptFileName=FeatherTracker.Database.sql /p:TargetConnectionString="Data Source=SERVERIP;Persist Security Info=True;User ID=SERVERUSER;Password=SERVERPASS;Pooling=False;Multiple Active Result Sets=False;Connect Timeout=60;Encrypt=True;Trust Server Certificate=True;Command Timeout=0" .\Database\FeatherTracker.Database /p:Configuration=Release
