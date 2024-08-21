import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Card, CardContent, Box } from '@mui/material';
import { styled } from '@mui/system';
import Modal from 'react-modal';
import { useForm, Controller } from 'react-hook-form';
import { backend } from 'declarations/backend';

const HeroSection = styled('div')(({ theme }) => ({
  backgroundImage: 'url(https://loremflickr.com/g/1200/400/cryptocurrency?lock=1)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  height: '400px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  marginBottom: theme.spacing(4),
}));

const FloatingButton = styled(Button)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(4),
  right: theme.spacing(4),
}));

interface Post {
  title: string;
  body: string;
  author: string;
  timestamp: bigint;
}

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { control, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const fetchedPosts = await backend.getPosts();
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const onSubmit = async (data: { title: string; body: string; author: string }) => {
    try {
      await backend.createPost(data.title, data.body, data.author);
      setIsModalOpen(false);
      reset();
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <div>
      <HeroSection>
        <Typography variant="h2">Crypto Blog</Typography>
      </HeroSection>
      <Container maxWidth="md">
        {posts.map((post, index) => (
          <Card key={index} sx={{ marginBottom: 2 }}>
            <CardContent>
              <Typography variant="h5">{post.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                By {post.author} on {new Date(Number(post.timestamp) / 1000000).toLocaleString()}
              </Typography>
              <Typography variant="body1" sx={{ marginTop: 2 }}>
                {post.body}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Container>
      <FloatingButton variant="contained" color="primary" onClick={() => setIsModalOpen(true)}>
        New Post
      </FloatingButton>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            maxWidth: '500px',
            width: '100%',
          },
        }}
      >
        <Typography variant="h6" sx={{ marginBottom: 2 }}>
          Create New Post
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="title"
            control={control}
            defaultValue=""
            rules={{ required: 'Title is required' }}
            render={({ field, fieldState: { error } }) => (
              <Box sx={{ marginBottom: 2 }}>
                <Typography>Title</Typography>
                <input {...field} style={{ width: '100%' }} />
                {error && <Typography color="error">{error.message}</Typography>}
              </Box>
            )}
          />
          <Controller
            name="body"
            control={control}
            defaultValue=""
            rules={{ required: 'Body is required' }}
            render={({ field, fieldState: { error } }) => (
              <Box sx={{ marginBottom: 2 }}>
                <Typography>Body</Typography>
                <textarea {...field} style={{ width: '100%', minHeight: '100px' }} />
                {error && <Typography color="error">{error.message}</Typography>}
              </Box>
            )}
          />
          <Controller
            name="author"
            control={control}
            defaultValue=""
            rules={{ required: 'Author is required' }}
            render={({ field, fieldState: { error } }) => (
              <Box sx={{ marginBottom: 2 }}>
                <Typography>Author</Typography>
                <input {...field} style={{ width: '100%' }} />
                {error && <Typography color="error">{error.message}</Typography>}
              </Box>
            )}
          />
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default App;
