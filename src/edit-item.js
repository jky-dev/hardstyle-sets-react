import React from 'react';
import {
  Card,
  CardContent,
  FormControl,
  TextField,
  FormGroup,
  FormControlLabel,
  Button,
  Checkbox,
} from '@material-ui/core';
import { database } from './index';
import './edit-item.css';

function EditItem(props) {
  const youtubeUrl = 'https://www.youtube.com/watch?v=';
  const [video, setVideo] = React.useState(props.video);

  const handleChange = (event, video) => {
    const {name, checked, value, type} = event.target;
    if (type === 'checkbox') {
      video.details.setProps[name] = checked;
    } else {
      video.details.setProps[name] = value;
    }
    setVideo({...video, video});
  }

  const saveVideo = (event, video) => {
    updateVideo(video);
  }

  const updateVideo = (video) => {
    console.log('update key', video.id, 'with', video.details);
    let updateObj = {};
    updateObj[video.id] = video.details;
    database.ref().child('/videos/' + video.details.channelTitle).update(updateObj);
  }

  const openSet = () => {
    window.open(youtubeUrl + video.id, '_blank');
  }

  return (
    <Card variant="outlined">
      <CardContent>
      <span className="video-title">
        {video.details.title}
      </span>
      <br />
      <FormControl>
        <div>
          <TextField
            label="Set Name"
            name="setName"
            value={video.details.setProps.setName}
            onChange={(e) => handleChange(e, video)} />
        </div>
        <div>
          <TextField
            label="Festival"
            name="festival"
            value={video.details.setProps.festival}
            onChange={(e) => handleChange(e, video)} />
        </div>
        <div>
          <TextField
            label="Year"
            name="year"
            value={video.details.setProps.year}
            onChange={(e) => handleChange(e, video)} />
        </div>
        <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={video.details.setProps.isSet}
              onChange={(e) => handleChange(e, video)}
              name="isSet" />
          }
          label="Set?"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={video.details.setProps.isLive}
              onChange={(e) => handleChange(e, video)}
              name="isLive" />
          }
          label="Live?"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={video.details.setProps.isVerified}
              onChange={(e) => handleChange(e, video)}
              name="isVerified" />
          }
          label="Verified?"
        />
        </FormGroup>
      </FormControl>
      <div>
        <Button
          variant="contained"
          onClick={(e) => saveVideo(e, video)} >
          Save
        </Button>
        <Button
          variant="outlined"
          onClick={openSet}>View</Button>
      </div>
      </CardContent>
    </Card>
  )
}

export default EditItem;