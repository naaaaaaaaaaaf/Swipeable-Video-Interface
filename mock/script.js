document.addEventListener('DOMContentLoaded', (event) => {
    // アニメーションのためのCSSクラスを定義
    const swipeAnimationClass = 'swipe-animation';
    const swipeDuration = 500; // アニメーションの持続時間 (ミリ秒)
    
    const videoPlayer = document.getElementById('video-player');
    const seekBar = document.getElementById('seek-bar');

    // シークバーを動画の再生位置に同期
    videoPlayer.addEventListener('timeupdate', () => {
        const value = (100 / videoPlayer.duration) * videoPlayer.currentTime;
        seekBar.value = value;
    });

    // シークバーを操作したときに動画の再生位置を更新
    seekBar.addEventListener('input', () => {
        const time = videoPlayer.duration * (seekBar.value / 100);
        videoPlayer.currentTime = time;
    });
    const videoUrls = [
        'a.mp4',
        'b.mp4',
        'c.mp4',
        'd.mp4'
        // 他の動画のパスを追加
    ];
    let currentVideoIndex = 0;
    let isScrolling = false;
    let isChanging = false; 

    // ダブルクリックでの再生・停止の切り替え
    videoPlayer.addEventListener('click', () => {
        if (videoPlayer.paused) {
            videoPlayer.play();
            videoPlayer.classList.remove('paused');
        } else {
            videoPlayer.pause();
            videoPlayer.classList.add('paused');
        }
    });
// 動画の切り替え
    function changeVideo(index, direction) {
        if (index >= videoUrls.length) {
            index = 0; // 最初に戻る
        } else if (index < 0) {
            index = videoUrls.length - 1; // 最後の動画に移動
        }
        if (index >= 0 && index < videoUrls.length && !isChanging) {
            isChanging = true;

            // アニメーションの適用
            videoPlayer.classList.add(swipeAnimationClass);
            //videoPlayer.style.animationName = (direction === 'next') ? 'swipeLeft' : 'swipeRight';
            videoPlayer.style.animationName = (direction === 'next') ? 'swipeUp' : 'swipeDown';

            setTimeout(() => {
                videoPlayer.src = videoUrls[index];
                videoPlayer.load();
                currentVideoIndex = index;
                // アニメーション後のクリーンアップ
                videoPlayer.classList.remove(swipeAnimationClass);
                videoPlayer.style.animationName = '';
                isChanging = false;
            }, swipeDuration);
        }
    }

    // スワイプ処理
    videoPlayer.addEventListener('touchstart', (e) => {
        startY = e.touches[0].clientY;
    });

    videoPlayer.addEventListener('touchend', (e) => {
        handleSwipe(e.changedTouches[0].clientY);
    });

    // ホイール処理
    videoPlayer.addEventListener('wheel', (e) => {
        if (!isScrolling) {
            handleWheel(e.deltaY);
            isScrolling = true;
            setTimeout(() => {
                isScrolling = false;
            }, 1500); // 1.5秒のディレイ
        }
    });

    function handleSwipe(endY) {
        if (startY > endY + 50) {
            nextVideo();
        } else if (startY < endY - 50) {
            previousVideo();
        }
    }

    function handleWheel(deltaY) {
        if (deltaY > 0) {
            nextVideo();
        } else if (deltaY < 0) {
            previousVideo();
        }
    }

    function nextVideo() {
        console.log('next');
        changeVideo(currentVideoIndex + 1, 'next');
    }

    function previousVideo() {
        console.log('previous');
        changeVideo(currentVideoIndex - 1, 'previous');
    }

    // 最初の動画の読み込み
    changeVideo(0);
});
