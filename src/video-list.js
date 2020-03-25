import React from 'react';
import { Card,
  CardHeader,
  Grid,
  CardContent,
} from '@material-ui/core';
import './video-list.css';

function VideoList(props) {
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
                  <Card>
                    <CardHeader 
                      title={video.details.title}
                    />
                    <CardContent>
                      {video.details.title}
                      <br />
                      {video.details.description}
                    </CardContent>
                  </Card>
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