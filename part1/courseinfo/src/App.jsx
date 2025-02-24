const Header = (props) => {
  return (
    <h1>{props.course}</h1>
  )
}

const Part = (props) => {
  return (
    <p>
      {props.description} {props.exercise}
    </p>
  )
}
const Content = (props) => {
  return (
    <div> 
      <Part description={props.part[0].description} exercise={props.part[0].exercises} />
      <Part description={props.part[1].description} exercise={props.part[1].exercises} />
      <Part description={props.part[2].description} exercise={props.part[2].exercises} />
    </div>
  );
};

const Total = (props) => {
  return (
    <p>Number of exercises {props.part[0].exercises + props.part[1].exercises + props.part[2].exercises}</p>
  )
}
const App = () => {
  const course = 'Half Stack application development';
  const parts = [
    {
      description: 'Fundamentals of React',
      exercises: 10
    },
    {
      description: 'Using props to pass data',
      exercises: 7
    },
    {
      description: 'State of a component',
      exercises: 14
    }
  ]
  
  return (
    <div>
      <Header course={course} />
      <Content part={parts} />    
      <Total  part={parts} />
    </div>
  );
}

export default App
