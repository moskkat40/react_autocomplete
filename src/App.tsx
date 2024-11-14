import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { DropdownMenu } from './components/DropdownMenu';
import { Person } from './types/Person';
import debounce from 'lodash.debounce';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [title, setTitle] = useState(selectedPerson?.name || '');
  const [appliedTitle, setAppliedTitle] = useState('');

  const applyTitle = useCallback(debounce(setAppliedTitle, 300), []);

  useEffect(() => {
    setTitle(selectedPerson?.name || '');
  }, [selectedPerson]);

  const filteredUsers = useMemo(() => {
    return [...peopleFromServer].filter(person =>
      person.name.includes(appliedTitle),
    );
  }, [appliedTitle]);

  const [inputFieldFocus, setInputFieldFocus] = useState(false);

  function handleTitle(event: React.ChangeEvent<HTMLInputElement>) {
    setTitle(event.target.value);
    applyTitle(event.target.value);
  }

  function handleInputFieldFocus() {
    setInputFieldFocus(true);
  }

  function handleSelectPerson(person: Person) {
    setSelectedPerson(person);
    setInputFieldFocus(false);
  }

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson === null || title !== selectedPerson.name
            ? 'No selected person'
            : `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              value={title}
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              onChange={handleTitle}
              onClick={handleInputFieldFocus}
            />
          </div>
          {inputFieldFocus && (
            <DropdownMenu
              peopleFromServer={filteredUsers}
              onSelect={handleSelectPerson}
            />
          )}
        </div>
      </main>
    </div>
  );
};
