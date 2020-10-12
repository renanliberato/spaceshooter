import React from 'react';
import { PostGameScreen } from '../screens/PostGameScreen';

export function GameEndBehaviour({onWin, onLose, navigateBack, navigateTo}) {

    const hasOccurred = React.useRef(false);

    React.useEffect(() => {
        const onPlayerDestroyed = (e) => {
            if (!hasOccurred.current) {
                hasOccurred.current = true;
                onLose();
                setTimeout(() => {
                        navigateBack();
                        navigateTo(PostGameScreen, { playerWon: false });
                    }, 2000);
            }
        }

        const onEnemyDestroyed = (e) => {
            if (e.detail.enemiesLeft == 0 && !hasOccurred.current)
            {
                hasOccurred.current = true;
                onWin();
                setTimeout(() => {
                    navigateBack();
                    navigateTo(PostGameScreen, { playerWon: true });
                }, 2000);
            }
        }

        document.addEventListener('player_destroyed', onPlayerDestroyed);
        document.addEventListener('enemy_destroyed', onEnemyDestroyed);

        return () => {
            document.removeEventListener('player_destroyed', onPlayerDestroyed);
            document.removeEventListener('enemy_destroyed', onEnemyDestroyed);
        };
    }, []);

    return null;
}