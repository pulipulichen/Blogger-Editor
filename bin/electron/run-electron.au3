#pragma compile(Icon, '../../icon.ico')
FileChangeDir(@ScriptDir)
ShellExecute("run-electron.bat", "", "", "", @SW_HIDE)