console.log("Lets begin")

let currentSong = new Audio();
// let songs;
let currFolder;

let songs = [];

// Add an event listener to search input
document.getElementById('searchInput').addEventListener('input', function (e) {
    const query = e.target.value.toLowerCase();
    getSongs(currFolder, query);
});

async function getSongs(folder, query = '') {
    currFolder = folder;
    let a = await fetch(`/${folder}/`);
    let response = await a.text();

    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");

    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]);
        }
    }


    const filteredSongs = songs.filter(song => song.toLowerCase().includes(query.toLowerCase()));


    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    songul.innerHTML = '';


    filteredSongs.forEach(song => {
        songul.innerHTML += `   
            <li class="cursor-pointer flex justify-between md:w-96 flex-wrap ml-[1px] pt-3 md:p-3 border-2 border-r-2 m-3 rounded-xl">
                <img class="invert" src="/img/music.svg" alt="">
                <div class="info w-1/2">
                    <div class="break-words">${song.replaceAll("%20", " ")}</div>
                    <div class="">Artist Name</div>
                </div>
                <div class="play-now flex items-center gap-3">
                    <span>Play Now</span>
                    <img class="invert" src="/img/play.svg" alt="">
                </div>
            </li>`;
    });


    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener('click', () => {
            const songTitle = e.querySelector('.info').firstElementChild.innerHTML.trim();
            playMusic(songTitle);
        });
    });

    return songs;
}





















// this is used to convert the conds into minutes seconds for song update time
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

const playMusic = (track, pause = false) => {
    currentSong.src = `/${currFolder}/` + track;
    if (!pause) {
        currentSong.play();
        playButton.src = "src/img/pause.svg";

    }
    document.querySelector('.songinfo').innerHTML = decodeURI(track);


}


// first fetch that play from the htl and set into global var then use it
const playButton = document.querySelector('.play');




async function main() {
    await getSongs('songs/ncs')
    playMusic(songs[0], true)
    // displayalbums()
    // Atach an event listen to plya pause next and previous songs
    playButton.addEventListener('click', () => {
        if (currentSong.paused) {
            currentSong.play();
            playButton.src = "src/img/pause.svg";
            console.log('Play button clicked, playing song');
        } else {
            currentSong.pause();
            playButton.src = "src/img/play.svg";
            console.log('Play button clicked, pausing song');
        }
    });

    // curent song for timeupdate
    currentSong.addEventListener("timeupdate", () => {
        // console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";




    })
    // Attach an event listner to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })

    // add an event listener to hamburger


    document.querySelector(".humburger").addEventListener("click", () => {
        document.querySelector('.left').style.left = '0'
    }
    )
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector('.left').style.left = '-130%'
    }
    )


    // add an event listener to the next and previous buttons
    const previous = document.querySelector(".previous");
    previous.addEventListener("click", () => {
        currentSong.pause();

        console.log('previous song click')
        // console.log(currentSong.src);
        let index = songs.indexOf(currentSong.src.split('/').slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }

        // console.log(currentSong.src.split('/').slice(-1)[0])

    })

    const next = document.querySelector(".next");
    next.addEventListener("click", () => {
        // currentSong.pause();
        console.log('next song click')
        // console.log(currentSong.src);
        let index = songs.indexOf(currentSong.src.split('/').slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }

    })

    //add an event listen to volume
    document.querySelector('.range').getElementsByTagName('input')[0].addEventListener("change", (e) => {
        // console.log('setting value to', e.target.value);
        currentSong.volume = parseInt(e.target.value) / 100
        if (currentSong.volume > 0) {
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("/img/mute.svg", "/img/volume.svg")
        }

    })

    // add an event listner to make the volume mute

    document.querySelector('.volume>img').addEventListener('click', e => {

        if (e.target.src.includes('/img/volume.svg')) {

            e.target.src = e.target.src.replace('/img/volume.svg', '/img/mute.svg')
            currentSong.volume = 0;
            document.querySelector('.range').getElementsByTagName('input')[0].value = 0;
        }
        else {

            e.target.src = e.target.src.replace('/img/mute.svg', '/img/volume.svg')
            currentSong.volume = .10;
            document.querySelector('.range').getElementsByTagName('input')[0].value = 10;
        }
    })

    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            console.log("Fetching Songs")
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])







        })
    })
    // // hide and show the all button
    // const showAllButton = document.getElementById('showAllButton');
    // const cards = document.querySelectorAll('.card');

    // // Initially hide all cards except the first row
    // cards.forEach((card, index) => {
    //     if (index >= 4) {
    //         card.classList.add('hidden'); // Hide cards after the first 4
    //     }
    // });

    // // On button click, show all cards
    // showAllButton.addEventListener('click', () => {
    //     cards.forEach(card => {
    //         card.classList.remove('hidden'); // Show all cards
    //     });
    //     showAllButton.classList.add('hidden'); // Hide the button after click
    // });

}
async function displayalbums() {
    // await getSongs('songs/ncs')
    // playMusic(songs[0], true)
    // display all the albums on the page
    let a = await fetch((`/songs/`))
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")


    Array.from(anchors).forEach(async e => {

        if (e.href.includes("/songs")) {
            let folder = e.href.split("/").slice(-1)[0];
            let a = await fetch((`http://127.0.0.1:5500/songs/${folder}/info.json`))
            let response = await a.json();
            console.log(response);
            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}"
            class="card  mb-[17px] p-3 mx-4 rounded-xl w-[21%] text-white pt-3 cursor-pointer relative transition-all  hover:bg-[#252525] group">
                     <div class=" ">
                               <img class="text-black w-[41px] h-[38px] bg-[#1fdf64] rounded-full p-1 absolute bottom-[42px] right-[32px] opacity-0 group-hover:opacity-100 group-hover:translate-y-[-25px] transition-all  ease-out"
                                     id="play" src="play.svg" alt="">



                             </div>

                             <img class="rounded-xl"
                                 src="/songs/${folder}/cover.jpg"
                                 alt="">
                             <p class=>
                                  ${response.title} </p>
                             <p>${response.description}</p>
                         </div>`



        }
    }

    )
}




main()  