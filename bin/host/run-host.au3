#pragma compile(Icon, '../../icon.ico')
FileChangeDir(@ScriptDir)
ShellExecute("run-host.bat", "", "", "", @SW_HIDE)