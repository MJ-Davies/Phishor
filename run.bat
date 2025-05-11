@REM This bat script is to run the client and server simultaneously locally
@REM Supported for Windows 11
@REM Call run.bat in command prompt of this directory

@echo off
cd client
start npm run dev
cd ../server
start cargo run