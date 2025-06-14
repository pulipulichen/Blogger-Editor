# Blogger-Editor
An editor for Blogger writer

- Project: https://github.com/pulipulichen/Blogger-Editor/
- Issues: https://github.com/pulipulichen/Blogger-Editor/issues
- Online Demo: https://pulipulichen.github.io/Blogger-Editor/

* 需要Webpack編譯後才能生效，不能直接修改原始碼。

----

# How to build

1. Build the docker file:

````
npm run d0.build
````

2. Start to watch files in ./src

````
npm run d2.webpack-watch-development
````

3. Run index.html in a web server.

4. Modify a file in ./src and watch the changes.

5. When you complete a modification, compiling the files in production mode:

````
npm run d4.webpack-build-production
````

6. Commit and push to GitHub.

----

# Reference

https://summernote.org/getting-started/
https://summernote.org/deep-dive/#basic-api

https://fontawesome.com/icons

https://stackoverflow.com/questions/41383621/is-there-any-plugin-available-for-vuejs-in-netbeans-8-2

gedit /usr/local/netbeans-8.2/etc/netbeans.conf  

https://medium.freecodecamp.org/how-to-create-a-vue-js-app-using-single-file-components-without-the-cli-7e73e5b8244f

ICON: https://www.flaticon.com/free-icon/notebook_1928191#term=writing&page=3&position=79

---------

Crostini
![image](https://user-images.githubusercontent.com/2345913/61374274-89caa800-a8ce-11e9-836b-0352f47cee35.png)
1318*768

Chrome OS
![image](https://user-images.githubusercontent.com/2345913/61374286-94853d00-a8ce-11e9-9f25-5d363607ce91.png)
1310*768

# Docker編譯

安裝必要元件

````bash
sudo apt-get install docker-compose -y
````

如果執行docker-compose build的時候發生錯誤，這表示需要修正權限：( https://stackoverflow.com/a/70031270 )

````bash
sudo usermod -aG docker $USER
````

需要重新登入。

