module.exports = async (context) => {
  if (!context.config.mocks.enabled) {
    return { media: [] };
  }

  return {
    media: [
      {
        type: 'video',
        code: 'YvnPxqZEWVs',
        altText: '',
        subTitle: 'Stewie on Steroids',
        url: 'https://www.youtube.com/watch?v=YvnPxqZEWVs',
      },
      {
        type: 'image',
        code: null,
        altText: 'Image alt',
        subTitle: ' Image title',
        url: 'https://www.gstatic.com/webp/gallery/5.webp',
      },
      {
        type: 'video',
        code: '14644970',
        altText: '',
        subTitle: 'Weed Arrest',
        url: 'https://player.vimeo.com/14644970',
      },
      /*
        {
          type: 'video',
          code: '',
          altText: '',
          subTitle: 'AWS S3',
          url: 'https://shopgate-public.s3.amazonaws.com/video/20181029_155755.mp4'
        },
        {
          type: 'video',
          code: '',
          altText: '',
          subTitle: 'Dropbox',
          url: 'https://www.dropbox.com/s/4n0t0juclk2ysdd/20181029_155755.mp4'
        }
        */
    ],
  };
};
