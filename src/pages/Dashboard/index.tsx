import React, { useState, useEffect } from 'react';

import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/total.svg';
import {format} from 'date-fns';
import api from '../../services/api';

import Header from '../../components/Header';

import formatValue from '../../utils/formatValue';
import formatDate from '../../utils/formatDate';

import { Container, CardContainer, Card, TableContainer } from './styles';

interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: {title: string };
  created_at: Date;
}

interface Balance {
  income: string;
  outcome: string;
  total: string;
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>(
    {income: '100', outcome:'50', total:'50'} as Balance);

  const record_one = {
    id:"1",
    title: "Comuptador",
    value: 1000,
    formattedValue:formatValue(1000),
    formattedDate:format(new Date('2020-05-02 19:10:44'), 'dd/MM/yyyy'),
    type:"income",
    category: {title: "Sell"},
    created_at: new Date('2020-05-02 19:10:44')
  } as Transaction;


  useEffect(() => {
    setTransactions([ ... transactions, record_one]);
    console.log(transactions);
  }, []);

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      const response = await api.get('/transactions');

      const {
        transactions: transactionsData,
        balance: balanceData,
      } = response.data;

      setBalance(balanceData);

      const transactionsFormatted = transactionsData.map(
        (transaction: Transaction) => ({
          ...transaction,
          formattedValue: formatValue(transaction.value),
          formattedDate: formatDate(transaction.created_at),
        }),
      );

      setTransactions(transactionsFormatted);
    }

    loadTransactions();
  }, []);

  return (
    <>
      <Header />
      <Container>
        <CardContainer>
          <Card>
            <header>
              <p>Entradas</p>
              <img src={income} alt="Income" />
            </header>
            <h1 data-testid="balance-income">{formatValue(Number(balance.income))}</h1>
          </Card>
          <Card>
            <header>
              <p>Saídas</p>
              <img src={outcome} alt="Outcome" />
            </header>
            <h1 data-testid="balance-outcome">{formatValue(Number(balance.outcome))}</h1>
          </Card>
          <Card total>
            <header>
              <p>Total</p>
              <img src={total} alt="Total" />
            </header>
            <h1 data-testid="balance-total">{formatValue(Number(balance.total))}</h1>
          </Card>
        </CardContainer>

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Preço</th>
                <th>Categoria</th>
                <th>Data</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map(repository => (
                <tr key={repository.id}>
                  <td className="title">{repository.title}</td>
                  <td className={repository.type}>
                      {repository.type === 'income'
                        ? repository.formattedValue
                        : `- ${repository.formattedValue}`}
                    </td>
                  <td>{repository.category.title}</td>
                  <td>{repository.formattedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableContainer>
      </Container>
    </>
  );
};

export default Dashboard;
