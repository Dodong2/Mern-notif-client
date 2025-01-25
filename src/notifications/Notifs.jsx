/* notification pangkalahatan reusable */
    export const showNotif = (title, body) => {
        if(Notification.permission === 'granted') {
          new Notification('DodongApp', { body })
        } else if (Notification.permission !== 'denied') {
          Notification.requestPermission().then((permission) => {
            if (permission === 'granted') {
              new Notification('title', {body })
            }
          })
        }
      }
