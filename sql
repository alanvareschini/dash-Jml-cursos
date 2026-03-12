CREATE DATABASE IF NOT EXISTS jml_cursos;
USE jml_cursos;
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;
-- 1. Limpeza total da estrutura (Recria a tabela do zero)
DROP TABLE IF EXISTS respostas_origem;

CREATE TABLE respostas_origem (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome_evento VARCHAR(500) NOT NULL, 
    ano INT NOT NULL,
    origem VARCHAR(100) NOT NULL,
    quantidades_respostas INT DEFAULT 0, 
    tipo_evento VARCHAR(50), 
    local_evento VARCHAR(150) DEFAULT 'Brasil', 
    data_inicio DATE DEFAULT NULL,
    data_fim DATE DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci; 


TRUNCATE TABLE respostas_origem;

-- Núcleo Sistema S - Presencial
INSERT INTO respostas_origem (nome_evento, ano, origem, quantidades_respostas, tipo_evento, local_evento) VALUES 
('Núcleo Sistema S', 2024, 'Diretório Portal JML', 31, 'Presencial', 'São Paulo-SP'),
('Núcleo Sistema S', 2024, 'E-mail marketing', 79, 'Presencial', 'São Paulo-SP'),
('Núcleo Sistema S', 2024, 'Equipe de Vendas', 36, 'Presencial', 'São Paulo-SP'),
('Núcleo Sistema S', 2024, 'Indicação', 32, 'Presencial', 'São Paulo-SP'),
('Núcleo Sistema S', 2024, 'Redes Sociais', 19, 'Presencial', 'São Paulo-SP'),
('Núcleo Sistema S', 2024, 'Pesquisa na Internet', 8, 'Presencial', 'São Paulo-SP'),
('Núcleo Sistema S', 2024, 'Outros', 24, 'Presencial', 'São Paulo-SP');
-- Núcleo Sistema S - Online
INSERT INTO respostas_origem (nome_evento, ano, origem, quantidades_respostas, tipo_evento, local_evento) VALUES 
('Núcleo Sistema S', 2024, 'Diretório Portal JML', 23, 'Online', 'São Paulo-SP'),
('Núcleo Sistema S', 2024, 'E-mail marketing', 62, 'Online', 'São Paulo-SP'),
('Núcleo Sistema S', 2024, 'Equipe de Vendas', 9, 'Online', 'São Paulo-SP'),
('Núcleo Sistema S', 2024, 'Indicação', 43, 'Online', 'São Paulo-SP'),
('Núcleo Sistema S', 2024, 'Redes Sociais', 14, 'Online', 'São Paulo-SP'),
('Núcleo Sistema S', 2024, 'Pesquisa na Internet', 12, 'Online', 'São Paulo-SP'),
('Núcleo Sistema S', 2024, 'Outros', 25, 'Online', 'São Paulo-SP');

-- Seminário nacional AI - Misto
INSERT INTO respostas_origem (nome_evento, ano, origem, quantidades_respostas, tipo_evento, local_evento) VALUES 
('Seminário nacional inteligência artificial aplicada à elaboração e revisão de documentos de contratação pública ChatGPT & Gemini', 2024, 'Diretório Portal JML', 10, 'Presencial e Online', 'Brasília-DF'),
('Seminário nacional inteligência artificial aplicada à elaboração e revisão de documentos de contratação pública ChatGPT & Gemini', 2024, 'E-mail marketing', 21, 'Presencial e Online', 'Brasília-DF'),
('Seminário nacional inteligência artificial aplicada à elaboração e revisão de documentos de contratação pública ChatGPT & Gemini', 2024, 'Equipe de Vendas', 2, 'Presencial e Online', 'Brasília-DF'),
('Seminário nacional inteligência artificial aplicada à elaboração e revisão de documentos de contratação pública ChatGPT & Gemini', 2024, 'Indicação', 40, 'Presencial e Online', 'Brasília-DF'),
('Seminário nacional inteligência artificial aplicada à elaboração e revisão de documentos de contratação pública ChatGPT & Gemini', 2024, 'Redes Sociais', 7, 'Presencial e Online', 'Brasília-DF'),
('Seminário nacional inteligência artificial aplicada à elaboração e revisão de documentos de contratação pública ChatGPT & Gemini', 2024, 'Pesquisa na Internet', 1, 'Presencial e Online', 'Brasília-DF'),
('Seminário nacional inteligência artificial aplicada à elaboração e revisão de documentos de contratação pública ChatGPT & Gemini', 2024, 'Outros', 23, 'Presencial e Online', 'Brasília-DF');

INSERT INTO respostas_origem (nome_evento, ano, origem, quantidades_respostas, tipo_evento, local_evento) VALUES 
('Novo Regulamento de Licitações e Contratos do Sistema S', 2024, 'Diretório Portal JML', 10, 'Presencial', 'Curitiba-PR'),
('Novo Regulamento de Licitações e Contratos do Sistema S', 2024, 'E-mail marketing', 12, 'Presencial', 'Curitiba-PR'),
('Novo Regulamento de Licitações e Contratos do Sistema S', 2024, 'Equipe de Vendas', 13, 'Presencial', 'Curitiba-PR'),
('Novo Regulamento de Licitações e Contratos do Sistema S', 2024, 'Indicação', 7, 'Presencial', 'Curitiba-PR'),
('Novo Regulamento de Licitações e Contratos do Sistema S', 2024, 'Redes Sociais', 4, 'Presencial', 'Curitiba-PR'),
('Novo Regulamento de Licitações e Contratos do Sistema S', 2024, 'Pesquisa na Internet', 4, 'Presencial', 'Curitiba-PR'),
('Novo Regulamento de Licitações e Contratos do Sistema S', 2024, 'Outros', 12, 'Presencial', 'Curitiba-PR');

INSERT INTO respostas_origem (nome_evento, ano, origem, quantidades_respostas, tipo_evento, local_evento) VALUES 
('Seminário Nacional de Licitações e Contratos no Âmbito das Estatais', 2024, 'Diretório Portal JML', 8, 'Presencial e Online', 'Brasília-DF'),
('Seminário Nacional de Licitações e Contratos no Âmbito das Estatais', 2024, 'E-mail marketing', 9, 'Presencial e Online', 'Brasília-DF'),
('Seminário Nacional de Licitações e Contratos no Âmbito das Estatais', 2024, 'Equipe de Vendas', 5, 'Presencial e Online', 'Brasília-DF'),
('Seminário Nacional de Licitações e Contratos no Âmbito das Estatais', 2024, 'Indicação', 13, 'Presencial e Online', 'Brasília-DF'),
('Seminário Nacional de Licitações e Contratos no Âmbito das Estatais', 2024, 'Redes Sociais', 0, 'Presencial e Online', 'Brasília-DF'),
('Seminário Nacional de Licitações e Contratos no Âmbito das Estatais', 2024, 'Pesquisa na Internet', 4, 'Presencial e Online', 'Brasília-DF'),
('Seminário Nacional de Licitações e Contratos no Âmbito das Estatais', 2024, 'Outros', 17, 'Presencial e Online', 'Brasília-DF');

-- EVENTOS ANO 2023
INSERT INTO respostas_origem (nome_evento, ano, origem, quantidades_respostas, tipo_evento, local_evento) VALUES 
('Planejamento das contratações segundo a lei 14.133/2021', 2023, 'Diretório Portal JML', 7, 'Presencial', 'Curitiba-PR'),
('Planejamento das contratações segundo a lei 14.133/2021', 2023, 'E-mail marketing', 10, 'Presencial', 'Curitiba-PR'),
('Planejamento das contratações segundo a lei 14.133/2021', 2023, 'Equipe de Vendas', 0, 'Presencial', 'Curitiba-PR'),
('Planejamento das contratações segundo a lei 14.133/2021', 2023, 'Indicação', 3, 'Presencial', 'Curitiba-PR'),
('Planejamento das contratações segundo a lei 14.133/2021', 2023, 'Redes Sociais', 3, 'Presencial', 'Curitiba-PR'),
('Planejamento das contratações segundo a lei 14.133/2021', 2023, 'Pesquisa na Internet', 0, 'Presencial', 'Curitiba-PR'),
('Planejamento das contratações segundo a lei 14.133/2021', 2023, 'Outros', 5, 'Presencial', 'Curitiba-PR');

INSERT INTO respostas_origem (nome_evento, ano, origem, quantidades_respostas, tipo_evento, local_evento) VALUES 
('Núcleo S 20ª Edição - Contratações no Âmbito do Sistema S: Inovações e Transformações', 2023, 'Diretório Portal JML', 11, 'Presencial', 'Curitiba-PR'),
('Núcleo S 20ª Edição - Contratações no Âmbito do Sistema S: Inovações e Transformações', 2023, 'E-mail marketing', 57, 'Presencial', 'Curitiba-PR'),
('Núcleo S 20ª Edição - Contratações no Âmbito do Sistema S: Inovações e Transformações', 2023, 'Equipe de Vendas', 12, 'Presencial', 'Curitiba-PR'),
('Núcleo S 20ª Edição - Contratações no Âmbito do Sistema S: Inovações e Transformações', 2023, 'Indicação', 21, 'Presencial', 'Curitiba-PR'),
('Núcleo S 20ª Edição - Contratações no Âmbito do Sistema S: Inovações e Transformações', 2023, 'Redes Sociais', 5, 'Presencial', 'Curitiba-PR'),
('Núcleo S 20ª Edição - Contratações no Âmbito do Sistema S: Inovações e Transformações', 2023, 'Pesquisa na Internet', 5, 'Presencial', 'Curitiba-PR'),
('Núcleo S 20ª Edição - Contratações no Âmbito do Sistema S: Inovações e Transformações', 2023, 'Outros', 13, 'Presencial', 'Curitiba-PR');

INSERT INTO respostas_origem (nome_evento, ano, origem, quantidades_respostas, tipo_evento, local_evento) VALUES 
('Questões polêmicas sobre a nova lei de licitações - lei 14.133/21', 2023, 'Diretório Portal JML', 2, 'Presencial', 'Curitiba-PR'),
('Questões polêmicas sobre a nova lei de licitações - lei 14.133/21', 2023, 'E-mail marketing', 4, 'Presencial', 'Curitiba-PR'),
('Questões polêmicas sobre a nova lei de licitações - lei 14.133/21', 2023, 'Equipe de Vendas', 2, 'Presencial', 'Curitiba-PR'),
('Questões polêmicas sobre a nova lei de licitações - lei 14.133/21', 2023, 'Indicação', 6, 'Presencial', 'Curitiba-PR'),
('Questões polêmicas sobre a nova lei de licitações - lei 14.133/21', 2023, 'Redes Sociais', 0, 'Presencial', 'Curitiba-PR'),
('Questões polêmicas sobre a nova lei de licitações - lei 14.133/21', 2023, 'Pesquisa na Internet', 0, 'Presencial', 'Curitiba-PR'),
('Questões polêmicas sobre a nova lei de licitações - lei 14.133/21', 2023, 'Outros', 2, 'Presencial', 'Curitiba-PR');

-- 4º seminário nacional - gestão por competência e avaliação de desempenho
INSERT INTO respostas_origem (nome_evento, ano, origem, quantidades_respostas, tipo_evento, local_evento) VALUES 
('4º Seminário Nacional - Gestão por Competência e Avaliação de Desempenho com Foco em Sistema S, Estatais e Administração Pública', 2023, 'Diretório Portal JML', 4, 'Presencial', 'Curitiba-PR'),
('4º Seminário Nacional - Gestão por Competência e Avaliação de Desempenho com Foco em Sistema S, Estatais e Administração Pública', 2023, 'E-mail marketing', 11, 'Presencial', 'Curitiba-PR'),
('4º Seminário Nacional - Gestão por Competência e Avaliação de Desempenho com Foco em Sistema S, Estatais e Administração Pública', 2023, 'Equipe de Vendas', 4, 'Presencial', 'Curitiba-PR'),
('4º Seminário Nacional - Gestão por Competência e Avaliação de Desempenho com Foco em Sistema S, Estatais e Administração Pública', 2023, 'Indicação', 5, 'Presencial', 'Curitiba-PR'),
('4º Seminário Nacional - Gestão por Competência e Avaliação de Desempenho com Foco em Sistema S, Estatais e Administração Pública', 2023, 'Redes Sociais', 0, 'Presencial', 'Curitiba-PR'),
('4º Seminário Nacional - Gestão por Competência e Avaliação de Desempenho com Foco em Sistema S, Estatais e Administração Pública', 2023, 'Pesquisa na Internet', 0, 'Presencial', 'Curitiba-PR'),
('4º Seminário Nacional - Gestão por Competência e Avaliação de Desempenho com Foco em Sistema S, Estatais e Administração Pública', 2023, 'Outros', 6, 'Presencial', 'Curitiba-PR');

-- seminário nacional sistema s - do planejamento das contratações à gestão contratual
INSERT INTO respostas_origem (nome_evento, ano, origem, quantidades_respostas, tipo_evento, local_evento) VALUES 
('Seminário Nacional Sistema S: Do Planejamento das Contratações à Gestão Contratual - Boas Práticas da Nova Lei de Licitações e Aplicabilidade', 2023, 'Diretório Portal JML', 15, 'Presencial', 'Curitiba-PR'),
('Seminário Nacional Sistema S: Do Planejamento das Contratações à Gestão Contratual - Boas Práticas da Nova Lei de Licitações e Aplicabilidade', 2023, 'E-mail marketing', 8, 'Presencial', 'Curitiba-PR'),
('Seminário Nacional Sistema S: Do Planejamento das Contratações à Gestão Contratual - Boas Práticas da Nova Lei de Licitações e Aplicabilidade', 2023, 'Equipe de Vendas', 6, 'Presencial', 'Curitiba-PR'),
('Seminário Nacional Sistema S: Do Planejamento das Contratações à Gestão Contratual - Boas Práticas da Nova Lei de Licitações e Aplicabilidade', 2023, 'Indicação', 15, 'Presencial', 'Curitiba-PR'),
('Seminário Nacional Sistema S: Do Planejamento das Contratações à Gestão Contratual - Boas Práticas da Nova Lei de Licitações e Aplicabilidade', 2023, 'Redes Sociais', 2, 'Presencial', 'Curitiba-PR'),
('Seminário Nacional Sistema S: Do Planejamento das Contratações à Gestão Contratual - Boas Práticas da Nova Lei de Licitações e Aplicabilidade', 2023, 'Pesquisa na Internet', 1, 'Presencial', 'Curitiba-PR'),
('Seminário Nacional Sistema S: Do Planejamento das Contratações à Gestão Contratual - Boas Práticas da Nova Lei de Licitações e Aplicabilidade', 2023, 'Outros', 7, 'Presencial', 'Curitiba-PR');

-- inteligência artificial aplicada às licitações e contratações do sistema s: teoria & prática
-- EVENTOS ANO 2025
INSERT INTO respostas_origem (nome_evento, ano, origem, quantidades_respostas, tipo_evento, local_evento) VALUES 
('Inteligência Artificial Aplicada às Licitações e Contratações do Sistema S: Teoria & Prática', 2025, 'Diretório Portal JML', 6, 'Presencial', 'Curitiba-PR'),
('Inteligência Artificial Aplicada às Licitações e Contratações do Sistema S: Teoria & Prática', 2025, 'E-mail marketing', 7, 'Presencial', 'Curitiba-PR'),
('Inteligência Artificial Aplicada às Licitações e Contratações do Sistema S: Teoria & Prática', 2025, 'Equipe de Vendas', 2, 'Presencial', 'Curitiba-PR'),
('Inteligência Artificial Aplicada às Licitações e Contratações do Sistema S: Teoria & Prática', 2025, 'Indicação', 4, 'Presencial', 'Curitiba-PR'),
('Inteligência Artificial Aplicada às Licitações e Contratações do Sistema S: Teoria & Prática', 2025, 'Redes Sociais', 0, 'Presencial', 'Curitiba-PR'),
('Inteligência Artificial Aplicada às Licitações e Contratações do Sistema S: Teoria & Prática', 2025, 'Pesquisa na Internet', 0, 'Presencial', 'Curitiba-PR'),
('Inteligência Artificial Aplicada às Licitações e Contratações do Sistema S: Teoria & Prática', 2025, 'Outros', 1, 'Presencial', 'Curitiba-PR');

-- contratação de obras e serviços de engenharia em diversos regimes
INSERT INTO respostas_origem (nome_evento, ano, origem, quantidades_respostas, tipo_evento, local_evento) VALUES 
('Contratação de Obras e Serviços de Engenharia em Diversos Regimes', 2025, 'Diretório Portal JML', 3, 'Presencial', 'Brasília-DF'),
('Contratação de Obras e Serviços de Engenharia em Diversos Regimes', 2025, 'E-mail marketing', 8, 'Presencial', 'Brasília-DF'),
('Contratação de Obras e Serviços de Engenharia em Diversos Regimes', 2025, 'Equipe de Vendas', 3, 'Presencial', 'Brasília-DF'),
('Contratação de Obras e Serviços de Engenharia em Diversos Regimes', 2025, 'Indicação', 4, 'Presencial', 'Brasília-DF'),
('Contratação de Obras e Serviços de Engenharia em Diversos Regimes', 2025, 'Redes Sociais', 0, 'Presencial', 'Brasília-DF'),
('Contratação de Obras e Serviços de Engenharia em Diversos Regimes', 2025, 'Pesquisa na Internet', 0, 'Presencial', 'Brasília-DF'),
('Contratação de Obras e Serviços de Engenharia em Diversos Regimes', 2025, 'Outros', 8, 'Presencial', 'Brasília-DF');

-- 22º núcleo sistema s
INSERT INTO respostas_origem (nome_evento, ano, origem, quantidades_respostas, tipo_evento, local_evento) VALUES 
('22º Núcleo Sistema S', 2025, 'Diretório Portal JML', 6, 'Presencial', 'Fortaleza-CE'),
('22º Núcleo Sistema S', 2025, 'E-mail marketing', 11, 'Presencial', 'Fortaleza-CE'),
('22º Núcleo Sistema S', 2025, 'Equipe de Vendas', 10, 'Presencial', 'Fortaleza-CE'),
('22º Núcleo Sistema S', 2025, 'Indicação', 2, 'Presencial', 'Fortaleza-CE'),
('22º Núcleo Sistema S', 2025, 'Redes Sociais', 1, 'Presencial', 'Fortaleza-CE'),
('22º Núcleo Sistema S', 2025, 'Pesquisa na Internet', 0, 'Presencial', 'Fortaleza-CE'),
('22º Núcleo Sistema S', 2025, 'Outros', 3, 'Presencial', 'Fortaleza-CE');

-- 23º núcleo sistemas s - edição indústria
INSERT INTO respostas_origem (nome_evento, ano, origem, quantidades_respostas, tipo_evento, local_evento) VALUES 
('23º Núcleo Sistema S - Edição Indústria', 2025, 'Diretório Portal JML', 6, 'Presencial', 'Fortaleza-CE'),
('23º Núcleo Sistema S - Edição Indústria', 2025, 'E-mail marketing', 8, 'Presencial', 'Fortaleza-CE'),
('23º Núcleo Sistema S - Edição Indústria', 2025, 'Equipe de Vendas', 5, 'Presencial', 'Fortaleza-CE'),
('23º Núcleo Sistema S - Edição Indústria', 2025, 'Indicação', 7, 'Presencial', 'Fortaleza-CE'),
('23º Núcleo Sistema S - Edição Indústria', 2025, 'Redes Sociais', 1, 'Presencial', 'Fortaleza-CE'),
('23º Núcleo Sistema S - Edição Indústria', 2025, 'Pesquisa na Internet', 0, 'Presencial', 'Fortaleza-CE'),
('23º Núcleo Sistema S - Edição Indústria', 2025, 'Outros', 2, 'Presencial', 'Fortaleza-CE');

-- seminário nacional ia aplicada às licitações de compras, serviços e aos contratos da administração direta, estatais e sistema s
INSERT INTO respostas_origem (nome_evento, ano, origem, quantidades_respostas, tipo_evento, local_evento) VALUES 
('Seminário Nacional IA Aplicada às Licitações de Compras, Serviços e aos Contratos da Administração Direta, Estatais e Sistema S', 2025, 'Diretório Portal JML', 5, 'Presencial', 'Brasília-DF'),
('Seminário Nacional IA Aplicada às Licitações de Compras, Serviços e aos Contratos da Administração Direta, Estatais e Sistema S', 2025, 'E-mail marketing', 6, 'Presencial', 'Brasília-DF'),
('Seminário Nacional IA Aplicada às Licitações de Compras, Serviços e aos Contratos da Administração Direta, Estatais e Sistema S', 2025, 'Equipe de Vendas', 7, 'Presencial', 'Brasília-DF'),
('Seminário Nacional IA Aplicada às Licitações de Compras, Serviços e aos Contratos da Administração Direta, Estatais e Sistema S', 2025, 'Indicação', 5, 'Presencial', 'Brasília-DF'),
('Seminário Nacional IA Aplicada às Licitações de Compras, Serviços e aos Contratos da Administração Direta, Estatais e Sistema S', 2025, 'Redes Sociais', 0, 'Presencial', 'Brasília-DF'),
('Seminário Nacional IA Aplicada às Licitações de Compras, Serviços e aos Contratos da Administração Direta, Estatais e Sistema S', 2025, 'Pesquisa na Internet', 1, 'Presencial', 'Brasília-DF'),
('Seminário Nacional IA Aplicada às Licitações de Compras, Serviços e aos Contratos da Administração Direta, Estatais e Sistema S', 2025, 'Outros', 5, 'Presencial', 'Brasília-DF');

-- curso prático para formação e capacitação de fiscais e gestores de contratos
INSERT INTO respostas_origem (nome_evento, ano, origem, quantidades_respostas, tipo_evento, local_evento) VALUES 
('Formação e Capacitação de Fiscais e Gestores de Contratos', 2025, 'Diretório Portal JML', 3, 'Presencial', 'Curitiba-PR'),
('Formação e Capacitação de Fiscais e Gestores de Contratos', 2025, 'E-mail marketing', 1, 'Presencial', 'Curitiba-PR'),
('Formação e Capacitação de Fiscais e Gestores de Contratos', 2025, 'Equipe de Vendas', 4, 'Presencial', 'Curitiba-PR'),
('Formação e Capacitação de Fiscais e Gestores de Contratos', 2025, 'Indicação', 11, 'Presencial', 'Curitiba-PR'),
('Formação e Capacitação de Fiscais e Gestores de Contratos', 2025, 'Redes Sociais', 0, 'Presencial', 'Curitiba-PR'),
('Formação e Capacitação de Fiscais e Gestores de Contratos', 2025, 'Pesquisa na Internet', 4, 'Presencial', 'Curitiba-PR'),
('Formação e Capacitação de Fiscais e Gestores de Contratos', 2025, 'Outros', 7, 'Presencial', 'Curitiba-PR');

-- boas práticas nas contratações das estatais e a adoção de ferramentas de inteligência artificial: avanços e desafios
INSERT INTO respostas_origem (nome_evento, ano, origem, quantidades_respostas, tipo_evento, local_evento) VALUES 
('Boas Práticas nas Contratações das Estatais e a Adoção de Ferramentas de Inteligência Artificial: Avanços e Desafios', 2025, 'Diretório Portal JML', 1, 'Presencial', 'Curitiba-PR'),
('Boas Práticas nas Contratações das Estatais e a Adoção de Ferramentas de Inteligência Artificial: Avanços e Desafios', 2025, 'E-mail marketing', 4, 'Presencial', 'Curitiba-PR'),
('Boas Práticas nas Contratações das Estatais e a Adoção de Ferramentas de Inteligência Artificial: Avanços e Desafios', 2025, 'Equipe de Vendas', 1, 'Presencial', 'Curitiba-PR'),
('Boas Práticas nas Contratações das Estatais e a Adoção de Ferramentas de Inteligência Artificial: Avanços e Desafios', 2025, 'Indicação', 4, 'Presencial', 'Curitiba-PR'),
('Boas Práticas nas Contratações das Estatais e a Adoção de Ferramentas de Inteligência Artificial: Avanços e Desafios', 2025, 'Redes Sociais', 0, 'Presencial', 'Curitiba-PR'),
('Boas Práticas nas Contratações das Estatais e a Adoção de Ferramentas de Inteligência Artificial: Avanços e Desafios', 2025, 'Pesquisa na Internet', 2, 'Presencial', 'Curitiba-PR'),
('Boas Práticas nas Contratações das Estatais e a Adoção de Ferramentas de Inteligência Artificial: Avanços e Desafios', 2025, 'Outros', 1, 'Presencial', 'Curitiba-PR');

-- inovações nas contratações do sistema s
INSERT INTO respostas_origem (nome_evento, ano, origem, quantidades_respostas, tipo_evento, local_evento) VALUES 
('Inovações nas Contratações do Sistema S', 2025, 'Diretório Portal JML', 5, 'Presencial', 'Curitiba-PR'),
('Inovações nas Contratações do Sistema S', 2025, 'E-mail marketing', 10, 'Presencial', 'Curitiba-PR'),
('Inovações nas Contratações do Sistema S', 2025, 'Equipe de Vendas', 3, 'Presencial', 'Curitiba-PR'),
('Inovações nas Contratações do Sistema S', 2025, 'Indicação', 3, 'Presencial', 'Curitiba-PR'),
('Inovações nas Contratações do Sistema S', 2025, 'Redes Sociais', 1, 'Presencial', 'Curitiba-PR'),
('Inovações nas Contratações do Sistema S', 2025, 'Pesquisa na Internet', 1, 'Presencial', 'Curitiba-PR'),
('Inovações nas Contratações do Sistema S', 2025, 'Outros', 3, 'Presencial', 'Curitiba-PR');

INSERT INTO respostas_origem (nome_evento, ano, origem, quantidades_respostas, tipo_evento, local_evento) VALUES 
('Contratação de Obras e Serviços de Engenharia em Diversos Regimes', 2025, 'Diretório Portal JML', 6, 'Online', 'Brasil'),
('Contratação de Obras e Serviços de Engenharia em Diversos Regimes', 2025, 'E-mail marketing', 9, 'Online', 'Brasil'),
('Contratação de Obras e Serviços de Engenharia em Diversos Regimes', 2025, 'Equipe de Vendas', 3, 'Online', 'Brasil'),
('Contratação de Obras e Serviços de Engenharia em Diversos Regimes', 2025, 'Indicação', 8, 'Online', 'Brasil'),
('Contratação de Obras e Serviços de Engenharia em Diversos Regimes', 2025, 'Redes Sociais', 1, 'Online', 'Brasil'),
('Contratação de Obras e Serviços de Engenharia em Diversos Regimes', 2025, 'Pesquisa na Internet', 1, 'Online', 'Brasil'),
('Contratação de Obras e Serviços de Engenharia em Diversos Regimes', 2025, 'Outros', 7, 'Online', 'Brasil');

INSERT INTO respostas_origem (nome_evento, ano, origem, quantidades_respostas, tipo_evento, local_evento) VALUES 
('22º Núcleo Sistema S', 2025, 'Diretório Portal JML', 15, 'Online', 'Brasil'),
('22º Núcleo Sistema S', 2025, 'E-mail marketing', 21, 'Online', 'Brasil'),
('22º Núcleo Sistema S', 2025, 'Equipe de Vendas', 11, 'Online', 'Brasil'),
('22º Núcleo Sistema S', 2025, 'Indicação', 11, 'Online', 'Brasil'),
('22º Núcleo Sistema S', 2025, 'Redes Sociais', 4, 'Online', 'Brasil'),
('22º Núcleo Sistema S', 2025, 'Pesquisa na Internet', 1, 'Online', 'Brasil'),
('22º Núcleo Sistema S', 2025, 'Outros', 11, 'Online', 'Brasil');

INSERT INTO respostas_origem (nome_evento, ano, origem, quantidades_respostas, tipo_evento, local_evento) VALUES 
('23º Núcleo Sistema S - Edição Indústria', 2025, 'Diretório Portal JML', 6, 'Online', 'Brasil'),
('23º Núcleo Sistema S - Edição Indústria', 2025, 'E-mail marketing', 10, 'Online', 'Brasil'),
('23º Núcleo Sistema S - Edição Indústria', 2025, 'Equipe de Vendas', 4, 'Online', 'Brasil'),
('23º Núcleo Sistema S - Edição Indústria', 2025, 'Indicação', 15, 'Online', 'Brasil'),
('23º Núcleo Sistema S - Edição Indústria', 2025, 'Redes Sociais', 3, 'Online', 'Brasil'),
('23º Núcleo Sistema S - Edição Indústria', 2025, 'Pesquisa na Internet', 1, 'Online', 'Brasil'),
('23º Núcleo Sistema S - Edição Indústria', 2025, 'Outros', 10, 'Online', 'Brasil');

INSERT INTO respostas_origem (nome_evento, ano, origem, quantidades_respostas, tipo_evento, local_evento) VALUES 
('Governança das Contratações Públicas para o Poder Judiciário', 2025, 'Diretório Portal JML', 9, 'Online', 'Brasil'),
('Governança das Contratações Públicas para o Poder Judiciário', 2025, 'E-mail marketing', 5, 'Online', 'Brasil'),
('Governança das Contratações Públicas para o Poder Judiciário', 2025, 'Equipe de Vendas', 6, 'Online', 'Brasil'),
('Governança das Contratações Públicas para o Poder Judiciário', 2025, 'Indicação', 10, 'Online', 'Brasil'),
('Governança das Contratações Públicas para o Poder Judiciário', 2025, 'Redes Sociais', 2, 'Online', 'Brasil'),
('Governança das Contratações Públicas para o Poder Judiciário', 2025, 'Pesquisa na Internet', 24, 'Online', 'Brasil'),
('Governança das Contratações Públicas para o Poder Judiciário', 2025, 'Outros', 0, 'Online', 'Brasil');

INSERT INTO respostas_origem (nome_evento, ano, origem, quantidades_respostas, tipo_evento, local_evento) VALUES 
('Inovações nas Contratações do Sistema S', 2025, 'Diretório Portal JML', 3, 'Presencial e Online', 'Brasil'),
('Inovações nas Contratações do Sistema S', 2025, 'E-mail marketing', 1, 'Presencial e Online', 'Brasil'),
('Inovações nas Contratações do Sistema S', 2025, 'Equipe de Vendas', 2, 'Presencial e Online', 'Brasil'),
('Inovações nas Contratações do Sistema S', 2025, 'Indicação', 2, 'Presencial e Online', 'Brasil'),
('Inovações nas Contratações do Sistema S', 2025, 'Redes Sociais', 0, 'Presencial e Online', 'Brasil'),
('Inovações nas Contratações do Sistema S', 2025, 'Pesquisa na Internet', 6, 'Presencial e Online', 'Brasil'),
('Inovações nas Contratações do Sistema S', 2025, 'Outros', 0, 'Presencial e Online', 'Brasil');

INSERT INTO respostas_origem (nome_evento, ano, origem, quantidades_respostas, tipo_evento, local_evento) VALUES 
('Como Estimar e Comprar Melhor com IA: Desvendando o Apoio Especializado em Pesquisa de Preços e Decisões Baseadas em Dados', 2025, 'Diretório Portal JML', 5, 'Online', 'Brasil'),
('Como Estimar e Comprar Melhor com IA: Desvendando o Apoio Especializado em Pesquisa de Preços e Decisões Baseadas em Dados', 2025, 'E-mail marketing', 2, 'Online', 'Brasil'),
('Como Estimar e Comprar Melhor com IA: Desvendando o Apoio Especializado em Pesquisa de Preços e Decisões Baseadas em Dados', 2025, 'Equipe de Vendas', 4, 'Online', 'Brasil'),
('Como Estimar e Comprar Melhor com IA: Desvendando o Apoio Especializado em Pesquisa de Preços e Decisões Baseadas em Dados', 2025, 'Indicação', 6, 'Online', 'Brasil'),
('Como Estimar e Comprar Melhor com IA: Desvendando o Apoio Especializado em Pesquisa de Preços e Decisões Baseadas em Dados', 2025, 'Redes Sociais', 1, 'Online', 'Brasil'),
('Como Estimar e Comprar Melhor com IA: Desvendando o Apoio Especializado em Pesquisa de Preços e Decisões Baseadas em Dados', 2025, 'Pesquisa na Internet', 20, 'Online', 'Brasil'),
('Como Estimar e Comprar Melhor com IA: Desvendando o Apoio Especializado em Pesquisa de Preços e Decisões Baseadas em Dados', 2025, 'Outros', 0, 'Online', 'Brasil');

INSERT INTO respostas_origem (nome_evento, ano, origem, quantidades_respostas, tipo_evento, local_evento) VALUES
('Reforma Tributária e os Impactos nos Contratos Administrativos', 2025, 'Diretório Portal JML', 9, 'Online', 'Brasil'),
('Reforma Tributária e os Impactos nos Contratos Administrativos', 2025, 'E-mail marketing', 9, 'Online', 'Brasil'),
('Reforma Tributária e os Impactos nos Contratos Administrativos', 2025, 'Equipe de Vendas', 2, 'Online', 'Brasil'),
('Reforma Tributária e os Impactos nos Contratos Administrativos', 2025, 'Indicação', 13, 'Online', 'Brasil'),
('Reforma Tributária e os Impactos nos Contratos Administrativos', 2025, 'Redes Sociais', 1, 'Online', 'Brasil'),
('Reforma Tributária e os Impactos nos Contratos Administrativos', 2025, 'Pesquisa na Internet', 20, 'Online', 'Brasil'),
('Reforma Tributária e os Impactos nos Contratos Administrativos', 2025, 'Outros', 0, 'Online', 'Brasil');

-- Libera atualizações em massa (evita erro de Safe Update)
SET SQL_SAFE_UPDATES = 0;

-- 1. Limpeza de espaços em branco (Geral)
UPDATE respostas_origem SET 
    nome_evento = TRIM(nome_evento),
    origem = TRIM(origem),
    local_evento = TRIM(local_evento);

-- 2. Padronização da Origem (Corrige todas as variações para o nome oficial)
UPDATE respostas_origem 
SET origem = 'Diretório Portal JML' 
WHERE origem LIKE '%Diret% Portal JML' 
   OR origem IN ('Direto Portal JML', 'Portal JML');

-- 3. Padronização de nomes de eventos (Ajuste de maiúsculas/minúsculas)
UPDATE respostas_origem
SET nome_evento = REPLACE(nome_evento, 'sistema s', 'Sistema S')
WHERE nome_evento LIKE '%sistema s%';

-- 4. Diferenciação de eventos homônimos (Online vs Presencial)
-- Só executa se o nome for exatamente igual
UPDATE respostas_origem
SET nome_evento = CONCAT(nome_evento, ' - Online')
WHERE tipo_evento = 'Online' AND nome_evento NOT LIKE '%Online%';

UPDATE respostas_origem
SET nome_evento = CONCAT(nome_evento, ' - Presencial')
WHERE tipo_evento = 'Presencial' AND nome_evento NOT LIKE '%Presencial%';

-- Reativa a segurança do banco
SET SQL_SAFE_UPDATES = 1;

-- RELATÓRIO FINAL DE CONFERÊNCIA
SELECT ano, nome_evento, SUM(quantidades_respostas) AS total
FROM respostas_origem
GROUP BY ano, nome_evento
ORDER BY ano DESC, total DESC;

SELECT DISTINCT nome_evento FROM respostas_origem;


USE jml_cursos;

-- Ver se a tabela existe
SHOW TABLES;

