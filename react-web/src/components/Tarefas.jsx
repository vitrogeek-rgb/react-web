import {useState, useEffect} from 'react'
import '../css/estilo.css'

const Tarefas = () => {

    const [nome, setNome] = useState('');
    const [data, setData] = useState('');
    const [descricao, setDescricao] = useState('');
    const [prioridade, setPrioridade] = useState('media');

    //Hook - useState = Manipula o estado da variável
    const[tarefas,setTarefas]=useState(()=>{
        const salvarTarefas = localStorage.getItem('item-tarefa');
        return salvarTarefas ? JSON.parse(salvarTarefas) : [];
    });


    //HOOK - useEffect = Realiza o efeito colateral, 
    //nesse exemplo vai mostrar a tarefa adicionada em tempo real
    useEffect(()=>{
        localStorage.setItem('item-tarefa',JSON.stringify(tarefas))
    }, [tarefas])

    const adicionarTarefa = (e)=>{
      //previne que a página recarregue automaticamente
      e.preventDefault();
      //valida se o nome estiver vazio

    
      if(!nome.trim()) return;

      //novo objeto
      const novaTarefa={
        id: Date.now(),
        texto: nome,
        data: data,
        descricao: descricao,
        prioridade: prioridade,
        concluida: false
      }
      
      setTarefas([...tarefas,novaTarefa]);
      setNome('');
      setNome('');
      setData('');
      setDescricao('');
      setPrioridade('media');}

      const RemoverTarefa = (id)=>{
        // verifica se o id da tarefa atual é diferente do id que deseja apagar
        //se o id atual for igual a condição retorna falso e o item é excluído
        const apagarTarefa = tarefas.filter((tarefa) => tarefa.id !== id);
        setTarefas(apagarTarefa);
      }
      const marcarConcluida = (id)=>{
        const tarefasAtualizadas =tarefas.map((tarefa) =>{
          if (tarefa.id ===id) {
            return {...tarefa,concluida: !tarefa.concluida};
          }
          return tarefa  
        });
        setTarefas(tarefasAtualizadas);
      }


    
  return (
    <div>
      <h1>Minha lista de tarefas</h1>
      <form onSubmit={adicionarTarefa}>
        <input //Pede o nome da tarefa
          type="text"
          value={nome}
          onChange={(e)=>setNome(e.target.value)}
          placeholder='Digite sua tarefa'
        />

        <input type="Date" //Pede a data
          value={data}
          onChange={(e)=>setData(e.target.value)}
          placeholder='Data'
        />

        <textarea //Pede descrição da tarefa
          value={descricao} 
          onChange={(e)=>setDescricao(e.target.value)}
          placeholder='Descreva a tarefa'
        />
        <label htmlFor="prioridade">Prioridade</label>
        <select
          id="prioridade"
          value={prioridade}
          onChange={(e)=>setPrioridade(e.target.value)}
         > 
        {/* Mostra opções que podem ser selecionadas dentro das prioridades */}
          <option value="minima">Mínima</option>
          <option value="baixa">Baixa</option>
          <option value="media">Média</option>
          <option value="alta">Alta</option>
          <option value="urgente">Urgente</option>
         </select>
       
        <button type='submit'>Adicionar</button>
      </form>

      <ul className='space-y-3'>
        {tarefas.map((tarefa)=>(
          <li key={tarefa.id}>

            <button onClick={() => marcarConcluida(tarefa.id)}>
                {tarefa.concluida ? 'Desfazer':'Concluir'}
            </button>

            {tarefa.concluida ? <del><span>{tarefa.texto} {tarefa.data} {tarefa.descricao} {tarefa.prioridade}</span></del> : <span>{tarefa.texto} {tarefa.data} {tarefa.descricao} {tarefa.prioridade}</span>}

            
            <button onClick={()=>RemoverTarefa(tarefa.id)}>Excluir</button>
          </li>
        ))}
      </ul>
      {tarefas.length === 0 && <p>Nenhuma tarefa salva</p>}
    </div>
  )
}

export default Tarefas