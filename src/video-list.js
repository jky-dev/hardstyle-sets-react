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

  const ratio = video => {
    const total = parseInt(video.details.stats.likeCount) + parseInt(video.details.stats.dislikeCount);
    const likes = parseInt(video.details.stats.likeCount);
    return Math.round(likes * 100 / total);
  }

  const views = video => {
    const views = parseInt(video.details.stats.viewCount);

    if (views < 1000) return views;

    if (views < 1000000) {
      return Math.round(views/1000) + 'K';
    }

    return Math.round(views/100000)/10 + 'M';
  }

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
                        <span className="festival-name">{video.details.setProps.festival} {video.details.setProps.year}</span>
                        <span>{views(video)} views {ratio(video)}% rating</span>
                      </Typography>
                    </div>
                  </Fade>
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

export default VideoList;