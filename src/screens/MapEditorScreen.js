import React from 'react';
import { initMapEditor } from '../mapeditor';
import { PostGameScreen } from './PostGameScreen';

export function MapEditorScreen({ navigateBack, navigateTo, mapId }) {
    const gameContainerRef = React.useRef(null);
    const cancellationTokenRef = React.useRef({
        isCancelled: false
    });

    React.useEffect(() => {
        const height = Math.min(gameContainerRef.current.offsetHeight, window.innerHeight);
        initMapEditor(
            cancellationTokenRef.current,
            height,
            mapId
        );

        return () => {
            cancellationTokenRef.current.isCancelled = true;
        };
    }, []);

    return (
        <>
            <div ref={gameContainerRef} style={{
                flex: 1,
                alignSelf: 'center',
            }}>
                <div id='editor-container' style={{
                    position: 'relative',
                    flex: 1,
                    width: gameContainerRef.current ? gameContainerRef.current.offsetWidth : 0,
                    height: gameContainerRef.current ? gameContainerRef.current.offsetHeight : 0
                }}>
                    {/*<canvas id="arena"></canvas>*/}
                </div>
            </div>
        </>
    );
}