#pragma compile(Icon, 'icon.ico')
FileChangeDir(@ScriptDir)
ShellExecute("run.bat", "", "", "", @SW_HIDE)