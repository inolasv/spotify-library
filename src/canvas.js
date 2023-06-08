import React, { useEffect, useRef } from 'react';
import libraryBackground from './images/libraryBackground.png';

const Canvas = props => {
    
    const canvasRef = useRef(null);

    function wrapText(context, text, x, y, maxWidth, lineHeight) {
      let words = text.split(' ');
      let line = '';

      for(var n = 0; n < words.length; n++) {
        let testLine = line + words[n] + ' ';
        let metrics = context.measureText(testLine);
        var testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
          context.fillText(line, x, y);
          line = words[n] + ' ';
          y += lineHeight;
        }
        else {
          line = testLine;
        }
      }
      context.fillText(line, x, y);
    }


    useEffect(() => {
        const canvas = canvasRef.current
        canvas.allowTaint = true;

        const context = canvas.getContext('2d')
        context.fillStyle = 'tan'
        context.fillRect(0, 0, canvas.width, canvas.height);

        const drawShelf = ctx => {
            // ctx.fillStyle = 'brown';
            // ctx.strokeRect(50, 50, 1000, 1400);

            const img = new Image();
            img.src = libraryBackground;
            console.log(img.width)
            console.log(img.height)
            ctx.drawImage(img, 60, 10, img.width*1.86, img.height*1.95)
                
                //1062, 1250)
        }
    
        const drawArtists = (ctx, bx, by) => {
            const l = 125;
            let x = 112.5;
            const y = 150;
            for (let artist of props.artistImgs) {
                ctx.strokeRect(x-18.75, y-25, bx, by)

                const img = new Image();
                img.crossOrigin = "anonymous";
                img.src = artist.images[0].url;
                ctx.drawImage(img, x, y, l, l);
                
                ctx.fillStyle = 'black';
                ctx.font = '20px Rockwell';
                ctx.textAlign = 'center';
                ctx.fillText(artist.name, x + 62.5, y + 160, 160);
                x += (125 + l)
            }
        }
    
        const drawTracks = (ctx, row, start, end, bx, by) => {
            let x = 137.5
            let y = row;
            const l = 87.5
            for (let track of props.tracks.slice(start, end)) {
                ctx.strokeRect(x-37.5, y-75, bx, by)
                const img = new Image();
                img.crossOrigin = 'anonymous';
                img.src = track.album.images[0].url;
                ctx.drawImage(img, x, y+25, l, l)
                
                ctx.fillStyle = 'black';
                ctx.textAlign = 'center';
                ctx.font = '20px Rockwell';
                wrapText(ctx, track.name, x + (l/2), y - 50, 150, 20)

                let artists = '';
                for (let artist of track.artists) {
                    artists += artist.name
                }

                ctx.font = '15px Rockwell'
                wrapText(ctx, artists, x + (l/2), y + 70 + l, 160, 25)

                x += 162.5 + l;
            }
        }

        
        const drawGenres = (ctx, bx, by) => {
            let x = 187.5;
            let y = 1100;

            for (let genre of props.genres) {
                ctx.strokeRect(x-82.6, 1025, bx, by)
                
                ctx.font = '25px Rockwell'
                ctx.fillStyle = 'black';
                ctx.textAlign = 'center';
                wrapText(ctx, genre, x, y, 160, 30)

                x += 250
            }
        }

        const bx = 0 //162.5
        const by = 0 //250


        drawShelf(context)
        drawArtists(context, bx, by)
        drawTracks(context, 500, 0, 4, bx, by)
        drawTracks(context, 800, 4, 8, bx, by)
        drawGenres(context, bx, by)


        props.imageURL(canvas.toDataURL());


    }, [props]);
      
    return <canvas hidden ref={canvasRef} width={props.width} height={props.height}/>

}


export default Canvas;

