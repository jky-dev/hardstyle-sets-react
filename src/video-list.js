import React, { useEffect, useState } from 'react';
import YouTube from 'react-youtube';
import {
  Fade,
  Grid,
  Typography,
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import './video-list.css';

function VideoList(props) {
  const itemsPerPage = 24;
  // const [itemsPerPage, setItemsPerPage] = useState(24);
  const [paginationCount, setPaginationCount] = useState(Math.ceil(props.videos.length / itemsPerPage));
  const [startingIndex , setStartingIndex] = useState(0);
  const [clickedVideo, setClickedVideo] = useState({});

  const handlePageChange = (event, page) => {
    setStartingIndex((page - 1) * itemsPerPage);
    setClickedVideo({});
  }

  useEffect(() => {
    setPaginationCount(Math.ceil(props.videos.length / itemsPerPage));
  }, [props.videos]);

  const handleVideoClick = (id) => {
    window.open(youtubeUrl + id, "_blank");
  }

  const ytOpts = {
    playerVars: {
      autoplay: 1
    }
  }

  const youtubeUrl = 'https://www.youtube.com/watch?v=';
  return (
    <div className="grid-div">
      <div>
        <Grid
          container
          direction="row"
          justify="flex-start"
          alignItems="stretch"
          spacing={1}
        >
          {props.videos.slice(startingIndex, startingIndex + itemsPerPage).map(video =>
            <Grid
              item
              key={video.id}
              flexgrow={1}
              xs={6}
              sm={4}
              md={3}
              lg={2} >
              <Fade in={true}>
                <div className="video-item">
                  {clickedVideo[video.id]
                  ? <YouTube
                    videoId={video.id}
                    className="youtube-video"
                    opts={ytOpts} />
                  : <img onClick={() => handleVideoClick(video.id)} src={video.details.thumbnails.medium.url} alt='video thumbnail'/> }
                  <Typography variant="body1">
                    <span className="set-name">{video.details.setProps.setName}</span>
                  </Typography>
                  <Typography variant="body2">
                    <span className="festival-name">{video.details.setProps.festival} - {video.details.setProps.year}</span>
                    <span>{video.details.stats.displayViews} views {video.details.stats.displayRatio}% rating</span>
                  </Typography>
                </div>
              </Fade>
            </Grid>
          )}
        </Grid>
        <div className="empty-div"></div>
        <Pagination count={paginationCount} onChange={handlePageChange} />
      </div>
    </div>
  )
}

export default VideoList;