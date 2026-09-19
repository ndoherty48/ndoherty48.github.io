#:package Aspire.Hosting.JavaScript@13.5.4
#:sdk Aspire.AppHost.Sdk@13.5.4

using Aspire.Hosting;

var builder = DistributedApplication.CreateBuilder(args);

var fe = builder.AddJavaScriptApp("frontend", "./frontend")
    .WithRunScript("dev")
    .WithBuildScript("build")
    .WithHttpEndpoint(targetPort: 4321, isProxied: false);

builder.Build().Run();

