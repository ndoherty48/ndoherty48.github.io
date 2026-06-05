#:package Aspire.Hosting.JavaScript@13.4.2
#:sdk Aspire.AppHost.Sdk@13.4.2

var builder = DistributedApplication.CreateBuilder(args);

var fe = builder.AddJavaScriptApp("frontend", "./frontend")
    .WithRunScript("dev")
    .WithBuildScript("build")
    .WithHttpEndpoint(targetPort: 4321, isProxied: false);

builder.Build().Run();

