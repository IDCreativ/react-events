<?php

namespace App\Controller\Dashboard;

use App\Entity\Poll;
use App\Form\PollType;
use App\Repository\PollRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/dashboard/poll")
 */
class PollController extends AbstractController
{
    /**
     * @Route("/", name="poll_index", methods={"GET"})
     */
    public function index(PollRepository $pollRepository): Response
    {
        return $this->render('dashboard/poll/index.html.twig', [
            'polls' => $pollRepository->findAll(),
        ]);
    }

    /**
     * @Route("/new", name="poll_new", methods={"GET","POST"})
     */
    public function new(Request $request): Response
    {
        $poll = new Poll();
        $form = $this->createForm(PollType::class, $poll);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($poll);
            $entityManager->flush();

            return $this->redirectToRoute('poll_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->renderForm('dashboard/poll/new.html.twig', [
            'poll' => $poll,
            'form' => $form,
        ]);
    }

    /**
     * @Route("/{id}", name="poll_show", methods={"GET"})
     */
    public function show(Poll $poll): Response
    {
        return $this->render('dashboard/poll/show.html.twig', [
            'poll' => $poll,
        ]);
    }

    /**
     * @Route("/{id}/edit", name="poll_edit", methods={"GET","POST"})
     */
    public function edit(Request $request, Poll $poll): Response
    {
        $form = $this->createForm(PollType::class, $poll);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->getDoctrine()->getManager()->flush();

            return $this->redirectToRoute('poll_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->renderForm('dashboard/poll/edit.html.twig', [
            'poll' => $poll,
            'form' => $form,
        ]);
    }

    /**
     * @Route("/{id}", name="poll_delete", methods={"POST"})
     */
    public function delete(Request $request, Poll $poll): Response
    {
        if ($this->isCsrfTokenValid('delete'.$poll->getId(), $request->request->get('_token'))) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->remove($poll);
            $entityManager->flush();
        }

        return $this->redirectToRoute('poll_index', [], Response::HTTP_SEE_OTHER);
    }
}
