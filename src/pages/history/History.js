import React, { useEffect, useState } from 'react';
import { getHistory } from '../../services/historyService';
import HistoryList from '../../components/history/HistoryList';
import { useSelector } from 'react-redux';

export default function History() {
    const [history, setHistory] = useState([]);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data = await getHistory(user.token);
                setHistory(data);
            } catch (err) {
                alert('Error al obtener historial');
            }
        };
        fetchHistory();
    }, [user]);

    return <HistoryList history={history} />;
}
