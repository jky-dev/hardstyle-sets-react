import React from 'react';
import { Grid } from '@material-ui/core';
import './edit-list.css';
import EditItem from './edit-item';

function EditList(props) {
  return (
    <div className="grid-div">
      {props.show
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
                <EditItem video={video}></EditItem>
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

export default EditList;