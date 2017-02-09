Set WshShell = CreateObject("WScript.Shell") 
WshShell.Run chr(34) & "C:\G-HELP-master\mongodb.bat" & Chr(34), 0
Set WshShell = Nothing

Set WshShell = CreateObject("WScript.Shell") 
WshShell.Run chr(34) & "C:\G-HELP-master\npmstart.bat" & Chr(34), 0
Set WshShell = Nothing