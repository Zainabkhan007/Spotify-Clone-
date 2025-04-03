async function main() {
    await getSongs('songs/ncs')
    playMusic(songs[0], true)
    await displayalbums() 

    
    setupPlayerControls(); 

    
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    });

    
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100;
    });

    
    setupVolumeControl(); 
}


function setupPlayerControls() {
    const playButton = document.querySelector("#play");
    const previousButton = document.querySelector(".previous");
    const nextButton = document.querySelector(".next");

    playButton.addEventListener('click', () => {
        if (currentSong.paused) {
            currentSong.play();
            playButton.src = "pause.svg";
            console.log('Play button clicked, playing song');
        } else {
            currentSong.pause();
            playButton.src = "play.svg";
            console.log('Play button clicked, pausing song');
        }
    });

    previousButton.addEventListener("click", () => {
        currentSong.pause();
        console.log('Previous song clicked');
        let index = songs.indexOf(currentSong.src.split('/').slice(-1)[0]);
        if (index - 1 >= 0) {
            playMusic(songs[index - 1]);
        }
    });

    nextButton.addEventListener("click", () => {
        currentSong.pause();
        console.log('Next song clicked');
        let index = songs.indexOf(currentSong.src.split('/').slice(-1)[0]);
        if (index + 1 < songs.length) {
            playMusic(songs[index + 1]);
        }
    });
}


function setupVolumeControl() {
    document.querySelector('.range input').addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100;
        if (currentSong.volume > 0) {
            document.querySelector('.volume > img').src = document.querySelector('.volume > img').src.replace('mute.svg', 'volume.svg');
        }
    });

    document.querySelector('.volume > img').addEventListener('click', (e) => {
        if (e.target.src.includes('volume.svg')) {
            e.target.src = e.target.src.replace('volume.svg', 'mute.svg');
            currentSong.volume = 0;
            document.querySelector('.range input').value = 0;
        } else {
            e.target.src = e.target.src.replace('mute.svg', 'volume.svg');
            currentSong.volume = 0.10;
            document.querySelector('.range input').value = 10;
        }
    });
}


async function displayalbums() {
    let a = await fetch('/songs/');
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");
    let cardContainer = document.querySelector(".cardContainer");

    Array.from(anchors).forEach(async e => {
        if (e.href.includes("/songs")) {
            let folder = e.href.split("/").slice(-1)[0];
            let a = await fetch(`http:
            let response = await a.json();
            console.log(response);
            cardContainer.innerHTML += `
                <div data-folder="${folder}" class="card mb-[17px] p-3 mx-4 rounded-xl w-[21%] text-white pt-3 cursor-pointer relative transition-all hover:bg-[#252525] group">
                    <div class=" ">
                        <img class="text-black w-[41px] h-[38px] bg-[#1fdf64] rounded-full p-1 absolute bottom-[42px] right-[32px] opacity-0 group-hover:opacity-100 group-hover:translate-y-[-25px] transition-all ease-out" id="play" src="play.svg" alt="">
                    </div>
                    <img class="rounded-xl" src="/songs/${folder}/cover.jpg" alt="">
                    <p>${response.title}</p>
                    <p>${response.description}</p>
                </div>
            `;
        }
    });

    
    cardContainer.addEventListener("click", async (item) => {
        if (item.target.closest('.card')) {
            let folder = item.target.closest('.card').dataset.folder;
            console.log("Fetching Songs for folder:", folder);
            songs = await getSongs(`songs/${folder}`);
            playMusic(songs[0]);
        }
    });
}
