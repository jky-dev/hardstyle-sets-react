import React from 'react';
import { 
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  TextField,
} from '@material-ui/core';
import './video-list.css';

function EditList(props) {
  const [editing, setEditing] = React.useState({
    enabled: false,
    id: '',
  });

  const handleChange = (event, id, video) => {
    console.log(event.target);
    console.log(event.target.value);
    console.log(event.target.name);
    console.log(id);
    console.log(video);
  }

  const handleEdit = (event, video) => {
    console.log(event.target);
    setEditing({
      editing: !editing.editing,
      id: video.id,
    });
  }

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
                    <CardContent>
                    {video.details.title}
                    <br />
                    <FormControl>
                      <div>
                        <TextField
                          id="standard-basic"
                          label="Set Name"
                          value={video.details.setProps.setName}
                          disabled={!(editing.enabled && video.id === editing.id)} />
                      </div>
                      <div>
                        <TextField
                          id="standard-basic"
                          label="Festival"
                          value={video.details.setProps.festival}
                          disabled={!(editing.enabled && video.id === editing.id)} />
                      </div>
                      <div>
                        <TextField
                          id="standard-basic"
                          label="Festival"
                          value={video.details.setProps.festival}
                          disabled={!(editing.enabled && video.id === editing.id)} />
                      </div>
                      <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={video.details.setProps.isSet}
                            onChange={(e) => handleChange(e, video.id, video)}
                            name="isSet"
                            disabled={!(editing.enabled && video.id === editing.id)} />
                        }
                        label="Set?"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={video.details.setProps.isLive}
                            onChange={(e) => handleChange(e, video.id, video)}
                            name="isLive"
                            disabled={!(editing.enabled && video.id === editing.id)} />
                        }
                        label="Live?"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={video.details.setProps.isVerified}
                            onChange={(e) => handleChange(e, video.id, video)}
                            name="isVerified"
                            disabled={!(editing.enabled && video.id === editing.id)} />
                        }
                        label="Verified?"
                      />
                      </FormGroup>
                    </FormControl>
                    <div>
                      <Button variant="outlined"
                        onClick={(e) => handleEdit(e, video)}
                        disabled={!(video.id === editing.id) && editing.enabled } >
                        {editing.editing && video.id === editing.id
                        ? 'Save'
                        : 'Edit'
                        }
                      </Button>
                    </div>
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

export default EditList;