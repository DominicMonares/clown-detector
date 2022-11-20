import sad_clown from '../assets/sad_clown.png';

const Offsite = () => {
  return (
    <div className='offsite'>
      <img src={sad_clown} alt='sad clown' />
      <p>Uh-oh! Looks like you aren't on a LinkedIn job post.</p>
      <p>Please visit the LinkedIn job board to use Clown Detector.</p>
    </div>
  );
}

export default Offsite;
