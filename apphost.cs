#:package Aspire.Hosting.JavaScript@13.3.5
#:sdk Aspire.AppHost.Sdk@13.3.5

var builder = DistributedApplication.CreateBuilder(args);

var fe = builder.AddJavaScriptApp("frontend", "./frontend")
    .WithRunScript("dev")
    .WithBuildScript("build")
    .WithHttpEndpoint(targetPort: 4321, isProxied: false);

builder.Build().Run();

