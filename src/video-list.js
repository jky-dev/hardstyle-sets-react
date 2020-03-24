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
      <Grid
        container
        direction="row"
        justify="space-evenly"
        alignItems="flex-start"
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
    </div>
  )
}

export default VideoList;