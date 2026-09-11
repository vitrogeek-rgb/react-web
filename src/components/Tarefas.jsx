import {useState, useEffect} from 'react'
import '../css/estilo.css'

const Tarefas = () => {

    // HOOK useState - guarda os dados do formulário
    const [nome, setNome] = useState('');
    const [data, setData] = useState('');
    const [descricao, setDescricao] = useState('');
    const [prioridade, setPrioridade] = useState('media');

    // HOOK useState - lista de tarefas; a função inicial lê do localStorage
    // apenas uma vez, na primeira renderização
    const[tarefas,setTarefas]=useState(()=>{
        const salvarTarefas = localStorage.getItem('item-tarefa');
        return salvarTarefas ? JSON.parse(salvarTarefas) : [];
    });

    // HOOK useState - controla o filtro ativo: 'todas', 'concluidas' ou 'pendentes'
    const [filtro, setFiltro] = useState('todas');

    // HOOK useEffect - roda sempre que "tarefas" muda, salvando no localStorage
    useEffect(()=>{
        localStorage.setItem('item-tarefa',JSON.stringify(tarefas))
    }, [tarefas])

    // CALLBACK passado para o onSubmit do form
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

      // spread (...tarefas) copia a lista atual e adiciona a nova tarefa
      setTarefas([...tarefas,novaTarefa]);
      setNome('');
      setData('');
      setDescricao('');
      setPrioridade('media');
    }

    // CALLBACK passado para o onClick de "Excluir"
    const RemoverTarefa = (id)=>{
      // MÉTODO DE ARRAY .filter() - mantém só as tarefas com id diferente
      const apagarTarefa = tarefas.filter((tarefa) => tarefa.id !== id);
      setTarefas(apagarTarefa);
    }

    // CALLBACK passado para o onClick de "Concluir/Desfazer"
    const marcarConcluida = (id)=>{
      // MÉTODO DE ARRAY .map() - percorre tudo e inverte "concluida" só na tarefa certa
      const tarefasAtualizadas =tarefas.map((tarefa) =>{
        if (tarefa.id ===id) {
          return {...tarefa,concluida: !tarefa.concluida};
        }
        return tarefa
      });
      setTarefas(tarefasAtualizadas);
    }

    // MÉTODO DE ARRAY .filter() - define o que é exibido, sem alterar "tarefas"
    const tarefasFiltradas = tarefas.filter((tarefa) => {
      if (filtro === 'concluidas') return tarefa.concluida;
      if (filtro === 'pendentes') return !tarefa.concluida;
      return true; // 'todas'
    });


  return (
    <div className='min-h-screen bg-[#F3E8D7] text-[#3D2B1F] px-6 py-10'>
      <div className="max-w-2xl mx-auto">
        <h1 className='text-2xl font-semibold mb-6'>Minha lista de tarefas</h1>

        <form
          onSubmit={adicionarTarefa}
          className='bg-[#FBF6ED] border border-[#E0D2B8] rounded-lg p-6 mb-6 flex flex-wrap gap-3 items-center'
        >
          <input //Pede o nome da tarefa
            type="text"
            value={nome}
            onChange={(e)=>setNome(e.target.value)}
            placeholder='Digite sua tarefa'
            className='flex-1 min-w-45 bg-[#F3E8D7] border border-[#E0D2B8] rounded-md px-4 py-2.5 text-[#3D2B1F] 
            placeholder-[#7A6752] focus:outline-none focus:ring-2 focus:ring-[#C1443A]'
          />

          <input type="Date" //Pede a data
            value={data}
            onChange={(e)=>setData(e.target.value)}
            placeholder='Data'
            className='bg-[#F3E8D7] border border-[#E0D2B8] rounded-md px-4 py-2.5 text-[#3D2B1F] focus:outline-none 
            focus:ring-2 focus:ring-[#C1443A]'
          />

          <select
            id="prioridade"
            value={prioridade}
            onChange={(e)=>setPrioridade(e.target.value)}
            className='bg-[#F3E8D7] border border-[#E0D2B8] rounded-md px-4 py-2.5 text-[#3D2B1F] focus:outline-none 
            focus:ring-2 focus:ring-[#C1443A]'
          >
          {/* Mostra opções que podem ser selecionadas dentro das prioridades */}
            <option value="minima">Mínima</option>
            <option value="baixa">Baixa</option>
            <option value="media">Média</option>
            <option value="alta">Alta</option>
            <option value="urgente">Urgente</option>
          </select>

          <button
            type='submit'
            className='bg-[#C1443A] hover:bg-[#A83428] text-white font-semibold px-6 py-2.5 rounded-md transition-colors'
          >
            Adicionar
          </button>

          <textarea //Pede descrição da tarefa
            value={descricao}
            onChange={(e)=>setDescricao(e.target.value)}
            placeholder='Descreva a tarefa'
            className='w-full bg-[#F3E8D7] border border-[#E0D2B8] rounded-md px-4 py-2.5 text-[#3D2B1F] placeholder-[#7A6752]
            focus:outline-none focus:ring-2 focus:ring-[#C1443A]'
          />
        </form>

        <div className='filtros'>
          <button
            onClick={() => setFiltro('todas')}
            disabled={filtro === 'todas'}
          >
            Todas
          </button>
          <button
            onClick={() => setFiltro('concluidas')}
            disabled={filtro === 'concluidas'}
          >
            Concluídas
          </button>
          <button
            onClick={() => setFiltro('pendentes')}
            disabled={filtro === 'pendentes'}
          >
            Pendentes
          </button>
        </div>

        <ul className='space-y-3'>
          {/* MÉTODO DE ARRAY .map() - transforma cada tarefa em um <li> */}
          {tarefasFiltradas.map((tarefa)=>(
            <li key={tarefa.id}>

              <button onClick={() => marcarConcluida(tarefa.id)}>
                  {tarefa.concluida ? 'Desfazer':'Concluir'}
              </button>

              {tarefa.concluida ? <del><span>{tarefa.texto} {tarefa.data} {tarefa.descricao} {tarefa.prioridade}</span></del> : <span>{tarefa.texto} {tarefa.data} {tarefa.descricao} {tarefa.prioridade}</span>}

              <button onClick={()=>RemoverTarefa(tarefa.id)}>Excluir</button>
            </li>
          ))}
        </ul>
        {tarefasFiltradas.length === 0 && <p>Nenhuma tarefa {filtro !== 'todas' ? filtro : 'salva'}</p>}
      </div>
    </div>
  )
}

export default Tarefas