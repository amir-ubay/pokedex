import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Star from "./assets/star.png";
import rawPokemon from "../data/pokemon.json";

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
// const supabase = createClient(supabaseUrl, supabaseKey);

function App() {
  const pokemon = rawPokemon.sort((a, b) => a.id - b.id);

  const initialTypes = ["All"];

  const [isLoading, setIsLoading] = useState(false);

  const [Pokemon, setPokemon] = useState([]);

  const [types, setTypes] = useState(initialTypes);

  const [totalPokemon, setTotalPokemon] = useState(0);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 100,
  });

  const [filterType, setFilterType] = useState("All");

  const [pageRange, setPageRange] = useState({
    start: 0,
    end: 99,
  });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterType = (type) => {
    setFilterType(type);
    setPagination({ ...pagination, currentPage: 1 });
    setPageRange({ ...pageRange, start: 0, end: 99 });
  };

  const handlePageChange = (page) => {
    const nextPage = page;
    setPagination({ ...pagination, currentPage: nextPage });
    console.log("pagination :>> ", nextPage);
    const nextStart = (nextPage - 1) * pagination.perPage;
    const nextEnd = nextStart + pagination.perPage - 1;
    setPageRange({ ...pageRange, start: nextStart, end: nextEnd });
    console.log("nextStart :>> ", nextStart);
    console.log("nextEnd :>> ", nextEnd);
  };

  useEffect(() => {
    const fetch = async (filterType) => {
      if (filterType === "All") {
        setPokemon(pokemon);
      } else {
        const filteredData = pokemon.filter(
          (item) => item.type_1 === filterType
        );
        setPokemon(filteredData);
      }
    };
    const fetchTypes = async () => {
      const typesPokemon = pokemon.map((item) => item.type_1);
      const uniqueTypes = Array.from(new Set(typesPokemon)).filter(
        (value, index, self) => {
          return self.indexOf(value) === index;
        }
      );
      setTypes(initialTypes.concat(uniqueTypes));
    };
    const getTotalPokemon = async (filterType) => {
      if (filterType === "All") {
        setTotalPokemon(pokemon.length);
      } else {
        const filteredPokemon = pokemon.filter(
          (item) => item.type_1 === filterType
        );
        setTotalPokemon(filteredPokemon.length);
      }
    };
    fetch(filterType);
    fetchTypes();
    getTotalPokemon(filterType);
    scrollToTop();
  }, [pagination, filterType]);

  return (
    <main className="max-w-screen-lg mx-auto">
      {/* <h1 className="text-3xl font-bold underline">Pokedex</h1> */}
      <div className="flex flex-row">
        <div
          className="basis-1/6 bg-white relative shadow-2xl z-10"
          id="side-menu"
        >
          <SideMenu data={types} handleFilterType={handleFilterType} />
        </div>
        {isLoading ? (
          <Loading />
        ) : (
          <div className="basis-5/6 relative" id="pokemon-list">
            <PokemonItem data={Pokemon} />
            <div className=" sticky bottom-0 mx-auto grid justify-items-center bg-white py-5 shadow-2xl z-5">
              <Pagination
                total={totalPokemon}
                data={pagination}
                handleClick={handlePageChange}
                range={pageRange}
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function PokemonItem({ data }) {
  const bgOdd = "pokemon-data flex flex-row bg-zinc-100";
  const bgEven = "pokemon-data flex flex-row bg-zinc-200";
  return (
    <>
      {data.map((pokemon, index) => {
        return (
          <div
            key={pokemon.id}
            id={pokemon.id}
            className={index % 2 ? bgOdd : bgEven}
          >
            <PokemonCard pokemon={pokemon} />
            <PokemonStats pokemon={pokemon} />
          </div>
        );
      })}
    </>
  );
}

function Loading() {
  return <span className="loading loading-ball loading-lg"></span>;
}

function SideMenu({ data, handleFilterType }) {
  return (
    <div className="container sticky top-0">
      <ul className="flex flex-col space-y-3 py-5">
        {data.map((type) => (
          <li key={type} className="px-4">
            <ButtonType
              type={type}
              handleFilterType={() => handleFilterType(type)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

function ButtonType({ type, handleFilterType }) {
  return (
    <button
      type="button"
      className="py-1 px-4  bg-slate-50 hover:bg-indigo-100 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-slate-600 w-full transition ease-in duration-200 text-center text-sm font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-sm uppercase"
      onClick={handleFilterType}
    >
      <Type type={type} />
    </button>
  );
  // return <button>{type}</button>;
}

function PokemonCard({ pokemon }) {
  const colors = ["red", "green"];

  const getPokemonId = () => {
    const data = String(pokemon.pokemon_id);
    const split = data.split("-");
    const result = split[0];
    return result;
  };

  const getPokemonName = () => {
    const data = String(pokemon.Name);
    const split = data.split(" ");
    let result = "";
    if (split.length > 1) {
      result = split.slice(1).join(" ");
      return result;
    } else {
      return data;
    }
  };

  return (
    <div className="w-1/2 p-10">
      <div className="card rounded-3xl grid justify-items-center bg-white relative p-4">
        <div className="absolute top-5 text-9xl font-bold -z-1 text-slate-200">
          #{getPokemonId()}
        </div>
        <div className="content grid justify-items-center z-0">
          {/* <div>{pokemon.id}</div> */}
          <div>
            <img
              style={{ width: "100px" }}
              src={`./pokemon_images/${pokemon.pokemon_id}.png`}
              alt={getPokemonName()}
            />
          </div>
          <div className="text-2xl font-semibold text-zinc-600">
            {getPokemonName()}
          </div>
          <div className="text-sm italic text-zinc-600 font-semibold">
            Gen-{pokemon.Generation}
          </div>
          <div className="types flex">
            <p>
              <Type type={pokemon.type_1} />
              {pokemon.type_2 && (
                <>
                  <span> - </span>
                  <Type type={pokemon.type_2} />
                </>
              )}
            </p>
          </div>
          <div className="absolute right-2 top-2 bg-transparent">
            <div className="star w-8 ">
              {pokemon.Legendary && <img src={Star} alt="star" />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PokemonStats({ pokemon }) {
  return (
    <div className="w-1/2 grid justify-items-start p-10 text-inherit">
      <div className="status-item text-zinc-500 font-medium">
        <table className="justify-end">
          <tbody>
            <tr>
              <td>Power</td>
              <td>
                <progress
                  className="progress mx-2 progress-primary w-56"
                  value={pokemon.Total}
                  max="1000"
                ></progress>
              </td>
              <td>{pokemon.Total}</td>
            </tr>
            <tr>
              <td>HP</td>
              <td>
                <progress
                  className="progress mx-2 progress-error w-56"
                  value={pokemon.HP}
                  max="100"
                ></progress>
              </td>
              <td>{pokemon.HP}</td>
            </tr>
            <tr>
              <td>Attack</td>
              <td>
                {" "}
                <progress
                  className="progress mx-2 progress-secondary w-56"
                  value={pokemon.Attack}
                  max="100"
                ></progress>
              </td>
              <td>{pokemon.Attack}</td>
            </tr>
            <tr>
              <td>Defense</td>
              <td>
                <progress
                  className="progress mx-2 progress-accent w-56"
                  value={pokemon.Defense}
                  max="100"
                ></progress>
              </td>
              <td>{pokemon.Defense}</td>
            </tr>
            <tr>
              <td>Sp. Atk</td>
              <td>
                {" "}
                <progress
                  className="progress mx-2 progress-success w-56"
                  value={pokemon["Sp. Atk"]}
                  max="100"
                ></progress>
              </td>
              <td>{pokemon["Sp. Atk"]}</td>
            </tr>
            <tr>
              <td>Sp. Def</td>
              <td>
                <progress
                  className="progress mx-2 progress-info w-56"
                  value={pokemon["Sp. Def"]}
                  max="100"
                ></progress>
              </td>
              {pokemon["Sp. Def"]}
            </tr>
            <tr>
              <td>Speed</td>
              <td>
                {" "}
                <progress
                  className="progress mx-2 progress-warning w-56"
                  value={pokemon.Speed}
                  max="100"
                ></progress>
              </td>
              <td>{pokemon.Speed}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Type({ type }) {
  function getColor(type) {
    switch (type) {
      case "Grass":
        return "green";
      case "Fire":
        return "red";
      case "Water":
        return "blue";
      case "Bug":
        return "#9DBA2A";
      case "Normal":
        return "gray";
      case "Poison":
        return "purple";
      case "Electric":
        return "#B37F22";
      case "Ground":
        return "brown";
      case "Fairy":
        return "pink";
      case "Fighting":
        return "orange";
      case "Psychic":
        return "pink";
      case "Rock":
        return "gray";
      case "Ghost":
        return "gray";
      case "Ice":
        return "blue";
      case "Dragon":
        return "purple";
      case "Dark":
        return "gray";
      case "Steel":
        return "gray";
      default:
        return "gray";
    }
  }

  const theColor = getColor(type);

  return (
    <span className="uppercase font-bold text-sm" style={{ color: theColor }}>
      {type}
    </span>
  );
}

const Pagination = ({ total, data, handleClick, range }) => {
  const totalPages = Math.ceil(total / data.perPage);
  const pagesArray = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  const active = "join-item btn btn-active";
  const nonActive = "join-item btn";

  return (
    <>
      {/* <div className="join mb-2" id="pagination">
        {pagesArray.map((page) => (
          <button
            className={page === data.currentPage ? active : nonActive}
            onClick={() => handleClick(page)}
          >
            {page}
          </button>
        ))}
      </div> */}
      <p>
        {total <= 100 ? (
          <>
            Displaying pokemon from {range.start + 1} to {total}
          </>
        ) : (
          <>
            Displaying pokemon from {range.start + 1} to {range.end + 1}
          </>
        )}
      </p>
    </>
  );
};

export default App;
