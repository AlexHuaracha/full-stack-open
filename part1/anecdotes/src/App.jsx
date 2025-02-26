import { useState } from 'react'

const Button = ({ onClick, text }) => (
  <button onClick={onClick}>{text}</button>
)

const getRandomInt = (max) => (Math.floor(Math.random() * max));

const MostVotes = ({votes, anecdotes, maxVotes}) => {
  if (maxVotes === 0) {
    return (
      <div>
        <br />
        There's no votes yet
      </div>
    );
  }

  const maxIndices = votes
    .map((vote, index) => vote === maxVotes ? index : null)
    .filter(index => index !== null);

  console.log(maxIndices);
  
  return (
    <div>
      <h1>Anecdote with most votes</h1>
      {anecdotes[votes.indexOf(maxVotes)]}
      <br />
      has {maxVotes} votes
    </div>
  );
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
  
  const [selected, setSelected] = useState(0)
  
  const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0))
  
  const handleClick = () => setSelected(getRandomInt(anecdotes.length))
  // console.log(votes);
  // console.log(selected);
  // console.log(votes[selected]);
  
  const maxVotes = Math.max(...votes);
  // console.log(maxVotes);
  
  // const handleVote = () => {
  //   const newVote = {
  //     ...votes,
  //     [selected]: votes[selected] + 1
  //   }
  //   setVotes(newVote)
  // }

  const handleVote = () => {
    const copy = [...votes]
    copy[selected] += 1
    setVotes(copy)
  }

  // console.log(getRandomInt(anecdotes.length));

  return (
    <div>
      <h1>Anecdote of the day</h1>
      {anecdotes[selected]}
      <br />
      has {votes[selected]} votes
      <br />
      <Button onClick={handleVote} text="Vote" />      
      <Button onClick={handleClick} text="Next anecdote" />      
      <br />
      <MostVotes votes={votes} anecdotes={anecdotes} maxVotes={maxVotes}/>
    </div>
  )
}

export default App