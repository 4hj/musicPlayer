
var backBtn = document.querySelector('.musicbox .back')
var playBtn = document.querySelector('.musicbox .play')
var forwardBtn = document.querySelector('.musicbox .forward')
var titleNode = document.querySelector('.musicbox .title')
var authorNode = document.querySelector('.musicbox .auther')
var timeNode = document.querySelector('.musicbox .time')
var progressBarNode = document.querySelector('.musicbox .progress .bar')
var progressNowNode = document.querySelector('.musicbox .progress-now')
var timer

var music = new Audio()
music.autoplay = true
var musicIndex = 0
var musicList = []
    
    getMusicList(function(list){
        console.log(list)
        musicList = list
        loadMusic(list[musicIndex])
        
    })

    function getMusicList(callback){
        var xhr = new XMLHttpRequest()
        xhr.open('GET', '/js/music.json', true)
        xhr.onload = function(){
            if((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304){
                callback(JSON.parse(this.responseText))   
            } else{
            console.log('获取数据失败')   
            }
        }
        xhr.onerror = function(){
            console.log('网络异常')
        }
        xhr.send()
    }

    playBtn.onclick = function(){
     var icon = this.querySelector('.fa')
     if(icon.classList.contains('fa-play')){
       music.play()
     }else{
       music.pause()
     }
     icon.classList.toggle('fa-play')
     icon.classList.toggle('fa-pause')
    }
    
    forwardBtn.onclick = loadNextMusic
    backBtn.onclick = loadLastMusic
    music.onended = loadNextMusic
    music.shouldUpdate = true
    
    
    music.onplaying = function(){
      timer = setInterval(function(){
        updateProgress()
      }, 1000)
      console.log('play')
    }
    music.onpause = function(){
      console.log('pause')
      clearInterval(timer)
    }
    /*
    music.ontimeupdate = function(){
      var _this = this
      if(_this.shouldUpdate) { 
         updateProgress()
         _this.shouldUpdate = false
        setTimeout(function(){
          _this.shouldUpdate = true
        }, 1000)
      }
    }
    */
    progressBarNode.onclick = function(e){
      var percent = e.offsetX/parseInt(getComputedStyle(this).width)
      music.currentTime = percent * music.duration
      progressNowNode.style.width = percent*100+"%"
    }
    
    
    
    
    function loadMusic(songObj){
      music.src = songObj.src
      titleNode.innerText = songObj.title
      authorNode.innerText = songObj.auther
    }
    
    function loadNextMusic(){
      musicIndex++
      musicIndex = musicIndex%musicList.length
      loadMusic(musicList[musicIndex])  
    }
    
    function loadLastMusic(){
      musicIndex--
      musicIndex = (musicIndex + musicList.length)%musicList.length
      loadMusic(musicList[musicIndex])  
    }
    
    function updateProgress(){
      var percent = (music.currentTime/music.duration)*100+'%'
      progressNowNode.style.width = percent
      
      var minutes = parseInt(music.currentTime/60)
      var seconds = parseInt(music.currentTime%60)+''
      seconds = seconds.length == 2? seconds : '0'+seconds
      timeNode.innerText = minutes + ':' + seconds
    }