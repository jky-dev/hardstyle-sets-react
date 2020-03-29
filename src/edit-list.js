import React, { useState, useEffect } from 'react';
import { Grid } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import './edit-list.css';
import EditItem from './edit-item';

function EditList(props) {
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [paginationCount, setPaginationCount] = useState(Math.ceil(props.videos.length / itemsPerPage));
  const [filters, setFilters] = useState({
    verified: false,
    set: false,
    live: false,
  });
  const [startingIndex , setStartingIndex] = useState(0);

  const handlePageChange = (event, page) => {
    setStartingIndex((page - 1) * itemsPerPage);
  }

  useEffect(() => {
    setPaginationCount(Math.ceil(props.videos.length / itemsPerPage));
  }, [props.videos]);

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
            {props.videos.slice(startingIndex, startingIndex + itemsPerPage).map(video =>
              <Grid item key={video.id}>
                <EditItem video={video}></EditItem>
              </Grid>
            )}
            </Grid>
            <div className="empty-div"></div>
            <Pagination count={paginationCount} onChange={handlePageChange} />
          </div>
        : <div></div>
      }
    </div>
  )
}

export default EditList;