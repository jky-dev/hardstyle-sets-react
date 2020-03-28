import React from 'react';
import { Card,
  Fade,
  Grid,
  CardContent,
  Typography,
} from '@material-ui/core';
import './video-list.css';

function VideoList(props) {
  const youtubeUrl = 'https://www.youtube.com/watch?v=';
  return (
    <div className="grid-div">
      { props.show
        ? <div>
            <Grid
              container
              direction="row"
              justify="flex-start"
              alignItems="stretch"
              spacing={2}
            >
              {props.videos.map(video =>
                <Grid item key={video.id}>
                  <Fade in={true}>
                    <Card>
                      <CardContent>
                        <Typography>
                          {video.details.setProps.festival} {video.details.setProps.year}
                          <br />
                          <span className="set-name">{video.details.setProps.setName}</span>
                          <br />
                        </Typography>
                        <img onClick={() => {window.open(youtubeUrl + video.id, '_blank')}} src={video.details.thumbnails.medium.url} />
                      </CardContent>
                    </Card>
                  </Fade>
                </Grid>
              )}
            </Grid>
            <div className="empty-div"></div>
          </div>
        : <div></div>
    }
    </div>
  )
}

export default VideoList;