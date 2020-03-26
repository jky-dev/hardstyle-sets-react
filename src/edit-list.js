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
import './edit-list.css';

function EditList(props) {
  // const [map, setMap] = React.useState(props.videos);
  const map = props.videos;
  const [tempValue, setTempValue] = React.useState('');
  const [editing, setEditing] = React.useState({
    enabled: false,
    id: '',
  });
  // TODO: each video is its own component - so that only that component
  // is rerendered when we edit it 
  // we can just use arrays instead of maps
  const handleChange = (event, key) => {
    console.log(event.target);
    console.log(event.target.value);
    console.log(event.target.name);
    console.log(key);
    setTempValue(event.target.value);
    // const newValue = {};
    // newValue[event.target.name] = event.target.value;
    // const newMapValue = Object.assign({}, map.get(key), { setProps: newValue });
    // map.set(map.get(key), newMapValue);
  }

  const handleEdit = (event, key) => {
    console.log(event.target);
    editing.enabled && updateVideo(key);
    setEditing({
      enabled: !editing.enabled,
      id: key,
    });
  }

  const updateVideo = (key) => {
    console.log('update key', key);
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
              {
                [...map.keys()].map(key =>
                <Grid item key={key}>
                  <Card>
                    <CardContent>
                    <span className="key-title">
                      {map.get(key).title}
                    </span>
                    <br />
                    <FormControl>
                      <div>
                        <TextField
                          id="standard-basic"
                          label="Set Name"
                          name="setName"
                          // value={map.get(key).setProps.setName}
                          value={tempValue}
                          disabled={!(editing.enabled && key === editing.id)}
                          onChange={(e) => handleChange(e, key)} />
                      </div>
                      <div>
                        <TextField
                          id="standard-basic"
                          label="Festival"
                          name="festival"
                          value={map.get(key).setProps.festival}
                          disabled={!(editing.enabled && key === editing.id)}
                          onChange={(e) => handleChange(e, key)} />
                      </div>
                      <div>
                        <TextField
                          id="standard-basic"
                          label="Year"
                          name="year"
                          value={map.get(key).setProps.year}
                          disabled={!(editing.enabled && key === editing.id)}
                          onChange={(e) => handleChange(e, key)} />
                      </div>
                      <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={map.get(key).setProps.isSet}
                            onChange={(e) => handleChange(e, key)}
                            name="isSet"
                            disabled={!(editing.enabled && key === editing.id)} />
                        }
                        label="Set?"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={map.get(key).setProps.isLive}
                            onChange={(e) => handleChange(e, key)}
                            name="isLive"
                            disabled={!(editing.enabled && key === editing.id)} />
                        }
                        label="Live?"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={map.get(key).setProps.isVerified}
                            onChange={(e) => handleChange(e, key)}
                            name="isVerified"
                            disabled={!(editing.enabled && key === editing.id)} />
                        }
                        label="Verified?"
                      />
                      </FormGroup>
                    </FormControl>
                    <div>
                      <Button variant="outlined"
                        onClick={(e) => handleEdit(e, key)}
                        disabled={!(key === editing.id) && editing.enabled } >
                        {editing.enabled && key === editing.id
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