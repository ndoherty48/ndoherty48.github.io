#:package Aspire.Hosting.JavaScript@13.2.0-preview.1.25619.3
#:sdk Aspire.AppHost.Sdk@13.2.0-preview.1.25619.3

var builder = DistributedApplication.CreateBuilder(args);

var fe = builder.AddJavaScriptApp("frontend", "./frontend")
    .WithRunScript("dev")
    .WithBuildScript("build")
    .WithHttpEndpoint(targetPort: 4321, isProxied: false);

builder.Build().Run();
