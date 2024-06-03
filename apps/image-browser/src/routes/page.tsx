import { Image } from 'image-kit';
// import demo from 'image-kit/assets/work.jpg';
import './index.css';

const Index = () => {
  return (
    <div className="container-box">
      {<Image imgStyle={{ width: '200px' }} circle name="å" />}
    </div>
  );
};

export default Index;
