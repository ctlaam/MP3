const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBTn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playList = $('.playlist')
const PLAYER_STORAGE_KEY = 'F8_PLAYER'


const app = {
    currentIndex: 0,
    isPLaying : false,
    isRandom : false,
    isRepeat : false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs:[
        {
            name:'Hasaghi',
            singer:'BIG DICK',
            path:'./assets/music/song1.mp3',
            image:'./assets/img/1.jpg'
        },
        {
            name:'Hasaghi',
            singer:'BIG DICK',
            path:'./assets/music/song2.mp3',
            image:'./assets/img/2.jpg'
        },
        {
            name:'Hasaghi',
            singer:'BIG DICK',
            path:'./assets/music/song3.mp3',
            image:'./assets/img/2.jpg'
        },
        {
            name:'Hasaghi',
            singer:'BIG DICK',
            path:'./assets/music/song4.mp3',
            image:'./assets/img/3.jpg'
        },
        {
            name:'Hasaghi',
            singer:'BIG DICK',
            path:'./assets/music/song5.mp3',
            image:'./assets/img/1.jpg'
        },
        {
            name:'Hasaghi',
            singer:'BIG DICK',
            path:'./assets/music/song6.mp3',
            image:'./assets/img/2.jpg'
        },
        {
            name:'Hasaghi',
            singer:'BIG DICK',
            path:'./assets/music/song7.mp3',
            image:'./assets/img/3.jpg'
        },
        {
            name:'Hasaghi',
            singer:'BIG DICK',
            path:'./assets/music/song8.mp3',
            image:'./assets/img/2.jpg'
        }
        
    ],
    setConfig: function(key,value){
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY,JSON.stringify(this.config))
    },
    render: function(){
        const htmls = this.songs.map((song,index) =>{
            return `<div class="song ${index === this.currentIndex ? 'active':''}" data-index ="${index}">
            <div class="thumb" style="background-image: url('${song.image}')">
            </div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
          </div>`
        })
        playList.innerHTML = htmls.join('')
    },
    defineProperties:function(){
        Object.defineProperty(this, 'currentSong', {
            get:function(){
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents:function(){
        const _this = this
        const cdWidth = cd.offsetWidth

        // xu ly cd quay
        const cdThumbAnimate = cdThumb.animate([
            {
                transform: 'rotate(360deg)'
            }
        ],{
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause()

        document.onscroll = function(){
            const scrollTop = window.scrollY
            const newCdWidth = cdWidth - scrollTop
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }
        playBtn.onclick = function(){
            if (_this.isPLaying){         
                audio.pause()
                
            } else {          
                audio.play()        
            }
            
        }
        // khi bai hat duoc play
        audio.onplay = function(){
            _this.isPLaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }
        audio.onpause = function(){
            _this.isPLaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }
        // Khi tien do bai hat thay doi
        audio.ontimeupdate = function(){
            if(audio.duration){
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
            //  xu ly khi tua
            progress.onchange = function(e){
                const seektime = e.target.value / 100 * audio.duration
                audio.currentTime = seektime
            }
        }
        // Next bai hat
        nextBtn.onclick = function(){
            if (_this.isRandom){
                _this.playRandomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        // prev bai hat
        prevBtn.onclick = function(){
            if (_this.isRandom){
                _this.playRandomSong()
            } else {
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        // Xy ly random bat tat
        randomBTn.onclick = function(e){
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom',_this.isRandom)
            randomBTn.classList.toggle('active',_this.isRandom)
            
        }
        // xu ly next song khi audio ended
        audio.onended = function(){
            if (_this.isRepeat){
                audio.play()
            } else {
                nextBtn.click()
            }
        }
        // xu ly lap lai bai
        repeatBtn.onclick = function(){
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat',_this.isRepeat)

            repeatBtn.classList.toggle('active',_this.isRepeat)

        }
        // Lang nghe hanh vi click vao playlist
        playList.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)')
            if (songNode ||  e.target.closest('.option')){
                // Xu ly khi click vao song
                if (songNode){
                   _this.currentIndex = Number(songNode.getAttribute('data-index'))
                   _this.loadCurrentSong()
                   _this.render()
                   audio.play()
                }
                // xu ly khi click vao option
                if (e.target.closest('.option')){

                }
            }
        }
    },
    scrollToActiveSong:function(){
        setTimeout(() =>{
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block:'center'
            })
        }, 200)
    },
    loadCurrentSong:function(){
        
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    loadConfig:function(){
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat

    },
    
    // next bai hat
    nextSong:function(){
        this.currentIndex++
        if ( this.currentIndex >= this.songs.length){
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong:function(){
        this.currentIndex--
        if ( this.currentIndex < 0){
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    playRandomSong: function(){
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },

    
    start: function(){
        // gan cau hinh tu config
        this.loadConfig()
        // Dinh nghia cac thuoc tinh cho object
        this.defineProperties()

        // lang nghe xu ly su kien
        this.handleEvents()
        // Tai thong tin bai hat dau tien UI khi chay ung dung
        this.loadCurrentSong()
        
        // Render bai hat
        this.render()
        // hien thi 
        repeatBtn.classList.toggle('active',this.isRepeat)
        randomBTn.classList.toggle('active',this.isRandom)
    }
}
app.start()
